"use client";

import { type FormEvent, useCallback, useState } from "react";

import type { Locale } from "@/i18n/config";
import { API_URL } from "@/lib/browserApi";

import { AuthInput } from "./AuthInput";
import { AuthToast } from "./AuthToast";
import { VkIdButton } from "./VkIdButton";

export interface SignUpLabels {
    password: string;
    submit: string;
    required: string;
    weakPassword: string;
    duplicate: string;
    invalid: string;
    maybeRegistered: string;
    signIn: string;
    forgot: string;
    consent: string;
    consentHint: string;
    acceptBefore: string;
    privacyPolicy: string;
    noPosting: string;
    deleted: string;
}

// Отметка «Хочу получать письма» переживает уход на сайт VK (GS-203): "1"/"0", нет записи — отмечено
const CONSENT_KEY = "gs.marketingConsentIntent";
const readConsent = () => {
    try {
        return window.sessionStorage.getItem(CONSENT_KEY) !== "0";
    } catch {
        return true;
    }
};
const writeConsent = (value: boolean | null) => {
    try {
        if (value === null) window.sessionStorage.removeItem(CONSENT_KEY);
        else window.sessionStorage.setItem(CONSENT_KEY, value ? "1" : "0");
    } catch {
        // приватный режим без sessionStorage — останется значение по умолчанию
    }
};

/** Почта для страницы «Письмо отправлено» (в старом фронте — redux register) */
export const REGISTER_EMAIL_KEY = "gs.registerEmail";

/**
 * Регистрация (SignUpContainer старого фронта): почта, пароль (не короче 6
 * символов и с цифрой), согласие на рассылку (по умолчанию стоит, решение
 * владельца 29.10.2026), вход через VK. После регистрации — страница
 * «Подтвердите почту»; после VK — сохранить согласие и в профиль.
 */
export function SignUpForm({ locale, signInHref, resetHref, privacyHref, confirmHref, profileHref, labels }: {
    locale: Locale;
    signInHref: string;
    resetHref: string;
    privacyHref: string;
    confirmHref: string;
    profileHref: string;
    labels: SignUpLabels;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string>();
    const [consent, setConsent] = useState(true);
    const [duplicate, setDuplicate] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const wording = `${labels.consent}. ${labels.consentHint}`;

    const changeConsent = (value: boolean) => {
        setConsent(value);
        writeConsent(value);
    };

    const afterVk = useCallback(async () => {
        const agreed = readConsent();
        writeConsent(null);
        if (agreed) {
            const token = JSON.parse(window.localStorage.getItem("token") ?? "null") as string | null;
            await fetch(`${API_URL}/api/v1/profile/marketing-consent`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ consent: true, source: "registration", wording }),
            }).catch(() => undefined);
        }
        window.location.href = profileHref;
    }, [profileHref, wording]);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!password) {
            setPasswordError(labels.required);
            return;
        }
        if (!/^(?=.*\d).{6,}$/.test(password)) {
            setPasswordError(labels.weakPassword);
            return;
        }
        setPasswordError(undefined);
        setBusy(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    plainPassword: password,
                    locale,
                    isActive: true,
                    marketingConsent: consent,
                    ...(consent ? { marketingConsentWording: wording } : {}),
                }),
            });
            if (response.ok) {
                window.sessionStorage.setItem(REGISTER_EMAIL_KEY, email);
                window.location.href = confirmHref;
                return;
            }
            const isDuplicate = response.status === 422;
            setDuplicate(isDuplicate);
            setToast(isDuplicate ? labels.duplicate : labels.invalid);
        } catch {
            setToast(labels.invalid);
        } finally {
            setBusy(false);
            setPassword("");
        }
    };

    return (
        <div className="flex w-full flex-col items-center">
            <AuthToast text={toast} onClose={() => setToast(null)} />
            <form onSubmit={submit} noValidate className="flex w-full max-w-[400px] flex-col">
                {duplicate && (
                    <div className="mt-2 text-[14px] text-caption">
                        {labels.maybeRegistered}{" "}
                        <a href={signInHref}>{labels.signIn}</a>{" / "}<a href={resetHref}>{labels.forgot}</a>
                    </div>
                )}
                <AuthInput label="E-mail" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                <AuthInput label={labels.password} type="password" autoComplete="new-password" value={password} error={passwordError} onChange={(event) => setPassword(event.target.value)} />
                <label className="flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => changeConsent(event.target.checked)}
                        className="relative h-[22px] w-[22px] shrink-0 cursor-pointer appearance-none rounded-[2px] border border-[#82949F] outline-none checked:bg-[url(/web/icons/auth/check.svg)] checked:bg-center checked:bg-no-repeat"
                    />
                    <span className="ml-2.5 leading-[138%] text-[#0e1d27] opacity-50">{labels.consent}</span>
                </label>
                <p className="mt-1 ml-8 text-[13px] leading-[1.4] text-caption">{labels.consentHint}</p>
                <button
                    type="submit"
                    disabled={busy}
                    className="mt-5 flex cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white down-lg:w-full down-lg:px-[15px]"
                >
                    {labels.submit}
                </button>
            </form>
            <div className="mt-[30px] mb-[50px] max-w-[344px] text-center text-[0.875rem] leading-[157%] text-caption">
                {labels.acceptBefore}{" "}
                <a href={privacyHref} className="text-[0.875rem] leading-[157%] text-[#6F828E]">{labels.privacyPolicy}</a>.
            </div>
            <VkIdButton locale={locale} page="signup" onSuccess={afterVk} onError={setToast} deletedText={labels.deleted} />
            <p className="mt-5 text-[0.875rem] font-medium text-ink-secondary opacity-50 max-[667px]:hidden">{labels.noPosting}</p>
        </div>
    );
}
