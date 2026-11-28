/**
 * «Пригласи друга»: код из ссылки ?ref=… запоминаем в браузере, а когда человек войдёт
 * (после регистрации по почте или через VK) — один раз передаём на сервер.
 */
import { type Locale, withLocale } from "@/i18n/config";
import { storageGet, storageRemove, storageSet } from "@/lib/safeStorage";

const KEY = "gs.ref";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type Stored = { code: string; at: number };

export function rememberReferral(search: string, now = Date.now()): void {
    const code = new URLSearchParams(search).get("ref")?.trim().toLowerCase();
    if (!code || !/^[a-z0-9]{4,12}$/.test(code)) return;
    try {
        storageSet(KEY, JSON.stringify({ code, at: now } satisfies Stored));
    } catch {
        // Приватный режим без хранилища — без приглашения
    }
}

export function storedReferral(now = Date.now()): string | null {
    try {
        const raw = storageGet(KEY);
        if (!raw) return null;
        const value = JSON.parse(raw) as Partial<Stored>;
        if (typeof value.code !== "string" || typeof value.at !== "number" || now - value.at > TTL_MS) {
            storageRemove(KEY);
            return null;
        }
        return value.code;
    } catch {
        return null;
    }
}

export function forgetReferral(): void {
    try {
        storageRemove(KEY);
    } catch {
        // нечего делать
    }
}

/**
 * Ссылка-приглашение на языке сайта, с которого делятся. Бэкенд строит её на
 * языке профиля — тестировщик с английским профилем отправлял во ВКонтакте
 * английскую главную (по ссылке ВКонтакте берёт заголовок и описание страницы).
 */
export function referralLink(origin: string, locale: Locale, code: string): string {
    return `${origin.replace(/\/$/, "")}${withLocale("/", locale)}?ref=${encodeURIComponent(code)}`;
}
