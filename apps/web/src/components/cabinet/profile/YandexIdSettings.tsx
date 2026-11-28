"use client";

import { useCallback, useEffect, useState } from "react";

import { goToYandex, YandexIdLogo } from "@/components/auth/YandexIdButton";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { safeSitePath } from "@/lib/authSession";
import { storageGet, storageRemove } from "@/lib/safeStorage";
import {
    fetchYandexAccount, fetchYandexProvider, type OAuthAccount, type OAuthProvider, unlinkYandex, YANDEX_LINKED_FLASH,
} from "@/lib/yandexId";
import type { YandexSettingsLabels } from "@/lib/yandexIdLabels";

type Message = { text: string; ok: boolean } | null;

const outlineButton = "cursor-pointer rounded-[10px] border border-primary px-[30px] py-2.5 text-[16px] leading-[120%] transition-all duration-300 disabled:cursor-default disabled:opacity-60";

/**
 * «Вход через Яндекс ID» в настройках (GS-336): привязан или нет, «Привязать»
 * (тот же поток, что вход, с режимом link) и «Отвязать». Отвязать нельзя, если
 * это единственный способ входа (canUnlink=false) — кнопка неактивна с
 * пояснением про пароль. Провайдер выключен или запрос не удался — блока нет.
 */
export function YandexIdSettings({ locale, labels }: { locale: Locale; labels: YandexSettingsLabels }) {
    const [account, setAccount] = useState<OAuthAccount | null>(null);
    const [provider, setProvider] = useState<OAuthProvider | null>(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<Message>(null);
    const closeMessage = useCallback(() => setMessage(null), []);

    useEffect(() => {
        let cancelled = false;
        void Promise.all([fetchYandexAccount().catch(() => null), fetchYandexProvider().catch(() => null)]).then(([nextAccount, nextProvider]) => {
            if (cancelled) return;
            setAccount(nextAccount);
            setProvider(nextProvider);
            // Только что вернулись с Яндекса после привязки
            if (nextAccount?.linked && storageGet(YANDEX_LINKED_FLASH, "session")) setMessage({ text: labels.linkedOk, ok: true });
            storageRemove(YANDEX_LINKED_FLASH, "session");
        });
        return () => {
            cancelled = true;
        };
    }, [labels.linkedOk]);
    // Ниже блока на странице ничего нет — пока грузится, место не держим
    if (!account) return null;

    const link = async () => {
        if (!provider || busy) return;
        setBusy(true);
        const here = safeSitePath(window.location.pathname) ?? "/";
        const ok = await goToYandex(provider, { mode: "link", locale, returnTo: here, backTo: here });
        if (!ok) {
            setBusy(false);
            setMessage({ text: labels.unavailable, ok: false });
        }
    };
    const unlink = async () => {
        if (busy) return;
        setBusy(true);
        const error = await unlinkYandex().catch(() => "unknown" as const);
        setBusy(false);
        if (error) {
            setMessage({ text: labels.errors[error], ok: false });
            if (error === "lastMethod") setAccount({ ...account, canUnlink: false });
            return;
        }
        setAccount({ ...account, linked: false });
        setMessage({ text: labels.unlinkedOk, ok: true });
    };

    return (
        <section aria-labelledby="yandex-id-title" className="mt-[50px] flex w-[440px] max-w-full flex-col gap-3 down-lg:w-full">
            <Toast text={message?.text ?? null} ok={message?.ok} onClose={closeMessage} />
            <h3 id="yandex-id-title" className="flex items-center gap-2.5 text-[18px] font-medium text-ink-secondary">
                <YandexIdLogo />
                {labels.title}
            </h3>
            <p className="text-[14px] leading-[140%] text-caption">{account.linked ? labels.linked : labels.notLinked}</p>
            {account.linked ? (
                <>
                    <button
                        type="button"
                        onClick={() => void unlink()}
                        disabled={busy || !account.canUnlink}
                        aria-describedby={account.canUnlink ? undefined : "yandex-id-unlink-hint"}
                        className={`${outlineButton} w-fit bg-white text-primary enabled:hover:bg-primary enabled:hover:text-white`}
                    >
                        {labels.unlink}
                    </button>
                    {!account.canUnlink && <p id="yandex-id-unlink-hint" className="text-[12px] leading-[140%] text-caption">{labels.cannotUnlink}</p>}
                </>
            ) : (
                <button
                    type="button"
                    onClick={() => void link()}
                    disabled={busy || !provider}
                    className={`${outlineButton} w-fit bg-primary text-white enabled:hover:bg-white enabled:hover:text-primary`}
                >
                    {labels.link}
                </button>
            )}
        </section>
    );
}
