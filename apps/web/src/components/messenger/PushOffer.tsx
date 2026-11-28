"use client";

import { useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browserApi";
import { currentPushSupport, isStandaloneDisplay, OFFER_DISMISSED_KEY, type PushSupport, shouldOffer, subscribePush } from "@/lib/webPush";
import { storageGet, storageSet } from "@/lib/safeStorage";

export interface PushOfferLabels {
    text: string;
    enable: string;
    later: string;
    iosText: string;
    ok: string;
    enabled: string;
    blocked: string;
    /** Разрешение дано, но браузер не умеет получать уведомления (сборки Chromium без службы уведомлений) */
    unsupported: string;
    /** Разрешение спрошено, а ответа нет: Chrome мог спрятать запрос в значок у адреса */
    noPrompt: string;
}

const dismissedAt = (): number | null => {
    const value = Number(storageGet(OFFER_DISMISSED_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
};

/**
 * Плашка «Включите уведомления» над списком переписок. Браузер спрашивает
 * разрешение только после нажатия «Включить» — если спросить сразу, люди
 * отказываются, и второй раз браузер уже не спросит. «Не сейчас» прячет на
 * 30 дней. Разрешение уже дано — тихо подписывает этот браузер на вошедшего
 * (новый вход, сменились ключи). На iPhone в Safari — подсказка добавить сайт
 * на экран «Домой»: иначе Apple не даёт пуши.
 *
 * Без переписок плашку не показываем — нечего ждать. Исключение — сайт,
 * открытый с экрана «Домой»: его ставят ради уведомлений, а на iPhone
 * разрешение можно спросить только по нажатию, так что кнопка «Включить»
 * нужна сразу, даже если переписок ещё нет.
 */
export function PushOffer({ token, enabled, hasChats, labels }: { token: string | undefined; enabled: boolean; hasChats: boolean; labels: PushOfferLabels }) {
    const [support, setSupport] = useState<PushSupport>("unsupported");
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [busy, setBusy] = useState(false);
    const [slow, setSlow] = useState(false);
    const [result, setResult] = useState<"enabled" | "blocked" | "unsupported" | null>(null);

    useEffect(() => {
        if (!enabled || (!hasChats && !isStandaloneDisplay())) return;
        const kind = currentPushSupport();
        // Определяется только в браузере, после загрузки
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSupport(kind);
        if (kind === "ios-install") {
            setVisible(dismissedAt() === null);
            return;
        }
        if (kind !== "supported") return;
        let cancelled = false;
        void browserApi(token).GET("/api/v1/web-push/key").then(({ data }) => {
            const key = (data as { publicKey?: string | null } | undefined)?.publicKey ?? null;
            if (cancelled || !key) return;
            setPublicKey(key);
            if (Notification.permission === "granted") {
                // Уведомления разрешены раньше, а этот браузер не умеет их получать — сказать
                // об этом (раз в 30 дней), а не молчать: человек ждёт уведомлений, а их не будет
                void subscribePush(token, key).then((outcome) => {
                    if (cancelled || outcome !== "unsupported" || !shouldOffer("default", dismissedAt(), Date.now())) return;
                    storageSet(OFFER_DISMISSED_KEY, String(Date.now()));
                    setResult("unsupported");
                    setVisible(true);
                });
            } else setVisible(shouldOffer(Notification.permission, dismissedAt(), Date.now()));
        }).catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [enabled, hasChats, token]);

    const later = useCallback(() => {
        storageSet(OFFER_DISMISSED_KEY, String(Date.now()));
        setVisible(false);
    }, []);

    const enable = async () => {
        if (!publicKey) return;
        setBusy(true);
        const slowTimer = window.setTimeout(() => setSlow(true), 4000);
        const permission = await Notification.requestPermission().catch(() => "denied" as const);
        const outcome = permission === "granted" ? await subscribePush(token, publicKey) : "failed";
        const ok = outcome === "ok";
        window.clearTimeout(slowTimer);
        setSlow(false);
        setBusy(false);
        // Разрешил, но подписка не создалась — браузер без службы уведомлений (Comodo Dragon и т. п.):
        // честно сказать и посоветовать другой браузер, а не «браузер не разрешил»
        setResult(ok ? "enabled" : permission === "granted" ? "unsupported" : "blocked");
        if (!ok && permission !== "denied") storageSet(OFFER_DISMISSED_KEY, String(Date.now()));
        window.setTimeout(() => setVisible(false), ok ? 4000 : 10000);
    };

    if (!visible) return null;
    const ios = support === "ios-install";
    return (
        <div role="status" data-nudge-blocker className="flex flex-col gap-2 border-b border-accent-bg bg-status-new/10 px-4 py-3 text-[13px] text-ink-secondary">
            {result ? (
                <>
                    <span>{result === "enabled" ? labels.enabled : result === "unsupported" ? labels.unsupported : labels.blocked}</span>
                    {result === "unsupported" && (
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setVisible(false)} className="h-8 cursor-pointer rounded-full border border-accent-bg bg-white px-3 text-[13px] text-ink-tertiary hover:border-primary">{labels.ok}</button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <span className="flex gap-2">
                        <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" /></svg>
                        {ios ? labels.iosText : labels.text}
                    </span>
                    {slow && <span className="text-ink">{labels.noPrompt}</span>}
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={later} className="h-8 cursor-pointer rounded-full border border-accent-bg bg-white px-3 text-[13px] text-ink-tertiary hover:border-primary">{ios ? labels.ok : labels.later}</button>
                        {!ios && (
                            <button type="button" disabled={busy} onClick={() => void enable()} className="h-8 cursor-pointer rounded-full border-0 bg-primary px-4 text-[13px] font-semibold text-white hover:bg-primary-hover disabled:opacity-60">{labels.enable}</button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
