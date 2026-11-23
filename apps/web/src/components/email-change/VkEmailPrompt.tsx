"use client";

import { useEffect, useState } from "react";

import { reachGoal } from "@/components/analytics/YandexMetrika";
import { blueButton, TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import { emailChangeErrorText, type EmailChangeErrorCode } from "@/lib/emailChange";
import { isPlaceholderEmail, VK_EMAIL_HIDDEN_KEY, vkEmailPromptHidden } from "@/lib/vkEmail";
import { storageSet } from "@/lib/safeStorage";

export interface VkEmailPromptLabels {
    title: string;
    text: string;
    email: string;
    submit: string;
    later: string;
    sent: string;
    pending: string;
    signInAgain: string;
    errors: Record<EmailChangeErrorCode | "network", string>;
}

type State = { email: string; hasPassword: boolean; pending: { newEmail: string; expiresAt: string } | null };

/**
 * «Укажите почту» для тех, кто вошёл через VK и почты не дал (вместо неё заглушка
 * …@vkontakte.ru): письма об ответе организатора, подборки и напоминания до них не доходят.
 * На 23.11.2026 таких 136 из 181 новых пользователей VK за месяц (решение бизнеса 23.11).
 * Почта сохраняется тем же путём, что «Изменить почту» в профиле: письмо со ссылкой на новый
 * адрес, пароля у VK-аккаунта нет — нужен недавний вход. «Позже» прячет плашку на 3 дня.
 */
export function VkEmailPrompt({ signInHref, labels, className = "" }: { signInHref: string; labels: VkEmailPromptLabels; /** Отступы снаружи — только когда плашка видна */ className?: string }) {
    const session = useSession();
    const [state, setState] = useState<State | null>(null);
    const [hidden, setHidden] = useState(true);
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<{ code: EmailChangeErrorCode | "network"; text: string } | null>(null);
    const [sentTo, setSentTo] = useState<string | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        // localStorage есть только в браузере — решение о показе после монтирования
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHidden(vkEmailPromptHidden(Date.now()));
        let cancelled = false;
        browserApi(session.token)
            .GET("/api/v1/email-change")
            .then(({ data }) => { if (!cancelled && data) setState(data as State); })
            .catch(() => undefined);
        return () => { cancelled = true; };
    }, [session.status, session.token]);

    if (!state || !isPlaceholderEmail(state.email)) return null;
    if (hidden && !sentTo && !state.pending) return null;

    const submit = async () => {
        if (busy || !email.trim()) return;
        setBusy(true);
        setError(null);
        try {
            const { data, error: failure, response } = await browserApi(session.token).POST("/api/v1/email-change", {
                body: { newEmail: email.trim(), password: null },
            });
            if (response.status === 202 && data) {
                setSentTo(data.sentTo);
                reachGoal("vk_email_requested");
            } else {
                const code = ((failure as { errorCode?: string } | undefined)?.errorCode ?? "unknown") as EmailChangeErrorCode;
                setError({ code, text: emailChangeErrorText(code, labels.errors) });
            }
        } catch {
            setError({ code: "network", text: labels.errors.network });
        } finally {
            setBusy(false);
        }
    };

    const later = () => {
        storageSet(VK_EMAIL_HIDDEN_KEY, String(Date.now()));
        setHidden(true);
    };

    return (
        <section aria-label={labels.title} className={`mb-5 flex w-full flex-col gap-3 rounded-[10px] border border-accent-bg bg-white px-5 py-4 shadow-[0_5px_20px_0_rgba(14,29,39,0.05)] ${className}`}>
            <h2 className="text-[18px] font-medium">{labels.title}</h2>
            {sentTo || state.pending ? (
                <p role="status" className="text-[14px] leading-[140%]">
                    {sentTo
                        ? labels.sent.replace("{{email}}", sentTo)
                        : labels.pending.replace("{{email}}", state.pending?.newEmail ?? "").replace("{{date}}", state.pending?.expiresAt ?? "")}
                </p>
            ) : (
                <form
                    className="flex flex-col gap-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void submit();
                    }}
                >
                    <p className="text-[14px] leading-[140%] text-caption">{labels.text}</p>
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="min-w-[240px] flex-1">
                            <TextField label={labels.email} type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                        </div>
                        <button type="submit" disabled={busy || !email.trim()} className={blueButton}>{labels.submit}</button>
                        <button type="button" onClick={later} className="cursor-pointer py-2 text-[14px] text-primary hover:underline">{labels.later}</button>
                    </div>
                    {error && (
                        <p role="alert" className="text-[14px] text-error">
                            {error.text}
                            {error.code === "reauth_required" && (
                                <>
                                    {" "}
                                    <button
                                        type="button"
                                        onClick={() => { void session.logout().then(() => { window.location.href = signInHref; }); }}
                                        className="cursor-pointer text-primary underline"
                                    >
                                        {labels.signInAgain}
                                    </button>
                                </>
                            )}
                        </p>
                    )}
                </form>
            )}
        </section>
    );
}
