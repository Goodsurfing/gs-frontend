import { browserApi } from "@/lib/browserApi";

/**
 * Веб-пуши о сообщениях и заявках (gs-backend: /api/v1/web-push/*). Service
 * worker — /web/push-sw.js, только для пушей (страницы не перехватывает), его
 * область — /web/push/, чтобы не влиять на сайт.
 */
export const PUSH_SW_URL = "/web/push-sw.js";
export const PUSH_SW_SCOPE = "/web/push/";
/** «Не сейчас» — снова предложим через 30 дней */
export const OFFER_PAUSE_MS = 30 * 24 * 3600 * 1000;
export const OFFER_DISMISSED_KEY = "gs-push-offer-dismissed";

/**
 * Можно ли подписаться в этом браузере: supported — да; ios-install — iPhone/iPad
 * в Safari без установки на экран «Домой» (Apple даёт пуши только установленному
 * сайту); unsupported — нет.
 */
export type PushSupport = "supported" | "ios-install" | "unsupported";

export function pushSupport(env: { userAgent: string; standalone: boolean; hasServiceWorker: boolean; hasPushManager: boolean; hasNotification: boolean }): PushSupport {
    if (env.hasServiceWorker && env.hasPushManager && env.hasNotification) return "supported";
    const ios = /iPhone|iPad|iPod/.test(env.userAgent) || (/Macintosh/.test(env.userAgent) && /Mobile/.test(env.userAgent));
    return ios && !env.standalone ? "ios-install" : "unsupported";
}

export function currentPushSupport(): PushSupport {
    if (typeof window === "undefined") return "unsupported";
    return pushSupport({
        userAgent: navigator.userAgent,
        standalone: window.matchMedia?.("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true,
        hasServiceWorker: "serviceWorker" in navigator,
        hasPushManager: "PushManager" in window,
        hasNotification: "Notification" in window,
    });
}

/** Предлагать ли включить уведомления: не решал или «Не сейчас» было больше 30 дней назад */
export function shouldOffer(permission: NotificationPermission | "unsupported", dismissedAt: number | null, now: number): boolean {
    if (permission !== "default") return false;
    return dismissedAt === null || now - dismissedAt > OFFER_PAUSE_MS;
}

/** Ключ VAPID (base64url) → байты для PushManager.subscribe */
export function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
    const base64 = (base64url + "=".repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    const bytes = new Uint8Array(new ArrayBuffer(raw.length));
    for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
    return bytes;
}

const sameKey = (subscription: PushSubscription, key: Uint8Array): boolean => {
    const current = subscription.options?.applicationServerKey;
    if (!current) return true;
    const bytes = new Uint8Array(current);
    return bytes.length === key.length && bytes.every((value, index) => value === key[index]);
};

/** Сколько ждать запуска service worker, прежде чем сдаться */
export const SW_ACTIVATE_TIMEOUT_MS = 10_000;

/** Что нужно от ServiceWorker (настоящий подходит; в тестах — заглушка) */
interface Worker {
    readonly state: string;
    addEventListener(type: "statechange", listener: () => void): void;
    removeEventListener(type: "statechange", listener: () => void): void;
}

/** Дождаться, пока service worker этой регистрации заработает (activated); false — не дождались */
export function workerActivated(
    registration: { active: Worker | null; installing: Worker | null; waiting: Worker | null },
    timeoutMs = SW_ACTIVATE_TIMEOUT_MS,
): Promise<boolean> {
    if (registration.active) return Promise.resolve(true);
    const worker = registration.installing ?? registration.waiting;
    if (!worker) return Promise.resolve(false);
    return new Promise((resolve) => {
        const timer = setTimeout(() => done(false), timeoutMs);
        function done(ok: boolean) {
            clearTimeout(timer);
            worker?.removeEventListener("statechange", onChange);
            resolve(ok);
        }
        function onChange() {
            if (worker?.state === "activated") done(true);
            else if (worker?.state === "redundant") done(false);
        }
        worker.addEventListener("statechange", onChange);
        onChange();
    });
}

/**
 * Подписать браузер вошедшего: service worker, подписка в браузере, запись на
 * сервере. Разрешение уже дано (granted). Подписка с другим ключом (ключи на
 * сервере сменились) пересоздаётся. Возвращает, получилось ли.
 */
export async function subscribePush(token: string | undefined, publicKey: string): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.register(PUSH_SW_URL, { scope: PUSH_SW_SCOPE });
        // Не navigator.serviceWorker.ready: он ждёт обработчик для адреса текущей страницы,
        // а у нашего область /web/push/ — на /messenger он не дождётся никогда (кнопка «Включить» зависала)
        if (!await workerActivated(registration)) return false;
        const key = keyBytes(publicKey);
        let subscription = await registration.pushManager.getSubscription();
        if (subscription && !sameKey(subscription, key)) {
            await subscription.unsubscribe().catch(() => undefined);
            subscription = null;
        }
        subscription ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
        const json = subscription.toJSON();
        const result = await browserApi(token).POST("/api/v1/web-push/subscriptions", {
            body: { endpoint: json.endpoint ?? "", keys: { p256dh: json.keys?.p256dh ?? "", auth: json.keys?.auth ?? "" } },
        });
        return !!result.response.ok;
    } catch {
        return false;
    }
}

/** Выход из аккаунта: этот браузер больше не получает пуши вышедшего */
export async function forgetPush(token: string | undefined): Promise<void> {
    try {
        if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
        const registration = await navigator.serviceWorker.getRegistration(PUSH_SW_SCOPE);
        const subscription = await registration?.pushManager.getSubscription();
        if (!subscription) return;
        await browserApi(token).POST("/api/v1/web-push/subscriptions/unregister", { body: { endpoint: subscription.endpoint }, keepalive: true }).catch(() => undefined);
        await subscription.unsubscribe();
    } catch {
        // Не вышло — сервер всё равно перестанет слать, когда сервис пушей ответит 410
    }
}
