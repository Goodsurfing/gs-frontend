"use client";

import { useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browserApi";
import { currentPushSupport, OFFER_DISMISSED_KEY, type PushSupport, shouldOffer, subscribePush } from "@/lib/webPush";

export interface PushOfferLabels {
    text: string;
    enable: string;
    later: string;
    iosText: string;
    ok: string;
    enabled: string;
    blocked: string;
}

const dismissedAt = (): number | null => {
    const value = Number(window.localStorage.getItem(OFFER_DISMISSED_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
};

/**
 * Плашка «Включите уведомления» над списком переписок. Браузер спрашивает
 * разрешение только после нажатия «Включить» — если спросить сразу, люди
 * отказываются, и второй раз браузер уже не спросит. «Не сейчас» прячет на
 * 30 дней. Разрешение уже дано — тихо подписывает этот браузер на вошедшего
 * (новый вход, сменились ключи). На iPhone в Safari — подсказка добавить сайт
 * на экран «Домой»: иначе Apple не даёт пуши.
 */
export function PushOffer({ token, enabled, labels }: { token: string | undefined; enabled: boolean; labels: PushOfferLabels }) {
    const [support, setSupport] = useState<PushSupport>("unsupported");
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<"enabled" | "blocked" | null>(null);

    useEffect(() => {
        if (!enabled) return;
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
            if (Notification.permission === "granted") void subscribePush(token, key);
            else setVisible(shouldOffer(Notification.permission, dismissedAt(), Date.now()));
        }).catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [enabled, token]);

    const later = useCallback(() => {
        window.localStorage.setItem(OFFER_DISMISSED_KEY, String(Date.now()));
        setVisible(false);
    }, []);

    const enable = async () => {
        if (!publicKey) return;
        setBusy(true);
        const permission = await Notification.requestPermission().catch(() => "denied" as const);
        const ok = permission === "granted" && await subscribePush(token, publicKey);
        setBusy(false);
        setResult(ok ? "enabled" : "blocked");
        if (!ok && permission !== "denied") window.localStorage.setItem(OFFER_DISMISSED_KEY, String(Date.now()));
        window.setTimeout(() => setVisible(false), 4000);
    };

    if (!visible) return null;
    const ios = support === "ios-install";
    return (
        <div role="status" className="flex flex-col gap-2 border-b border-accent-bg bg-status-new/10 px-4 py-3 text-[13px] text-ink-secondary">
            {result ? <span>{result === "enabled" ? labels.enabled : labels.blocked}</span> : (
                <>
                    <span className="flex gap-2">
                        <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" /></svg>
                        {ios ? labels.iosText : labels.text}
                    </span>
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
