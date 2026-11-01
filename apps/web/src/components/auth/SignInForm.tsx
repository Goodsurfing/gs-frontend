"use client";

import { type FormEvent, useCallback, useState } from "react";

import type { Locale } from "@/i18n/config";
import { localePrefix } from "@/i18n/config";
import { API_URL } from "@/lib/browserApi";
import { nextRoute, saveSession, type TokenResponse } from "@/lib/authSession";

import { AuthInput } from "./AuthInput";
import { AuthToast } from "./AuthToast";
import { VkIdButton } from "./VkIdButton";

export interface SignInLabels {
    password: string;
    submit: string;
    remember: string;
    forgot: string;
    notRegistered: string;
    signUp: string;
    deleted: string;
    /** Ответы API → тексты для человека (как errorMessages старого фронта) */
    errors: Record<string, string>;
}

/** Текст ошибки из ответа API (getErrorText старого фронта) */
export const apiErrorText = (body: unknown): string => {
    if (!body || typeof body !== "object") return "";
    const data = body as Record<string, unknown>;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.title === "string") return data.title;
    if (Array.isArray(data.errors) && data.errors.length > 0) return data.errors.join(". ");
    if (typeof data.error === "string") return data.error;
    if (typeof data.message === "string") return data.message;
    return "";
};

/**
 * Вход по почте и паролю (AuthByEmail старого фронта) и через VK ID.
 * После входа — туда, откуда пришли (?next=&nextId=), иначе в профиль.
 * Почта не подтверждена — письмо с подтверждением уходит ещё раз.
 */
export function SignInForm({ locale, resetHref, signUpHref, profileHref, labels }: {
    locale: Locale;
    resetHref: string;
    signUpHref: string;
    profileHref: string;
    labels: SignInLabels;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const done = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        window.location.href = nextRoute(localePrefix(locale), params.get("next"), params.get("nextId")) ?? profileHref;
    }, [locale, profileHref]);
    const showError = useCallback((text: string) => setError(labels.errors[text] ?? text), [labels.errors]);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setBusy(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/token`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, isRememberMe: remember }),
            });
            const body = await response.json().catch(() => null) as (TokenResponse & { type?: string }) | null;
            if (response.ok && body?.accessToken) {
                saveSession(body, email);
                done();
                return;
            }
            if (body?.type === "email_not_verified") {
                await fetch(`${API_URL}/api/v1/email-verifications/resend`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }).catch(() => undefined);
            }
            showError(apiErrorText(body) || "Ошибка авторизации");
            setPassword("");
        } catch {
            showError("Ошибка авторизации");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex w-full flex-col items-center">
            <AuthToast text={error} onClose={() => setError(null)} />
            <form onSubmit={submit} className="relative flex w-full max-w-[400px] flex-col">
                <AuthInput label="E-mail" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                <AuthInput label={labels.password} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                <button
                    type="submit"
                    disabled={busy}
                    className="flex cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white down-lg:w-full down-lg:px-[15px]"
                >
                    {labels.submit}
                </button>
                <div className="mt-[25px] mb-[65px] flex w-full items-center justify-between">
                    <label className="flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(event) => setRemember(event.target.checked)}
                            className="relative my-[3px] mr-[3px] ml-1 h-[22px] w-[22px] cursor-pointer appearance-none rounded-[2px] border border-[#82949F] outline-none checked:bg-[url(/web/icons/auth/check.svg)] checked:bg-center checked:bg-no-repeat"
                        />
                        <span className="ml-2.5 leading-[138%] text-[#0e1d27] opacity-50">{labels.remember}</span>
                    </label>
                    <a href={resetHref} className="leading-[138%] text-[#0e1d27] opacity-50">{labels.forgot}</a>
                </div>
            </form>
            <VkIdButton locale={locale} page="signin" onSuccess={done} onError={showError} deletedText={labels.deleted} />
            <div className="text-center leading-[138%] text-ink-secondary">
                {labels.notRegistered}{" "}
                <a href={signUpHref} className="font-semibold text-primary">{labels.signUp}</a>
            </div>
        </div>
    );
}
