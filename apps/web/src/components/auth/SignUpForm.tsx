"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { type Locale, localePrefix } from "@/i18n/config";
import { reachGoalThen } from "@/components/analytics/YandexMetrika";
import { keepReturn, returnAfterAuth } from "@/lib/authSession";
import { API_URL } from "@/lib/browserApi";
import { afterAuthTarget, goAfterAuth, saveRegistrationConsent } from "@/lib/socialLogin";
import type { OAuthProvider } from "@/lib/yandexId";

import { AuthInput } from "./AuthInput";
import { AuthToast } from "./AuthToast";
import { VkIdButton } from "./VkIdButton";
import { YandexIdButton } from "./YandexIdButton";
import { storageGet, storageRemove, storageSet } from "@/lib/safeStorage";
import { useHydrated } from "@/components/ui/useHydrated";

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
    /** Кнопка «Войти с Яндекс ID» */
    yandex?: { label: string; unavailable: string };
}

// Отметка «Хочу получать письма» переживает уход на сайт VK (GS-203): "1"/"0", нет записи — отмечено
const CONSENT_KEY = "gs.marketingConsentIntent";
const readConsent = () => {
    try {
        return storageGet(CONSENT_KEY, "session") !== "0";
    } catch {
        return true;
    }
};
const writeConsent = (value: boolean | null) => {
    try {
        if (value === null) storageRemove(CONSENT_KEY, "session");
        else storageSet(CONSENT_KEY, value ? "1" : "0", "session");
    } catch {
        // приватный режим без sessionStorage — останется значение по умолчанию
    }
};

/** Почта для страницы «Письмо отправлено» (в старом фронте — redux register) */
export const REGISTER_EMAIL_KEY = "gs.registerEmail";

/**
 * Регистрация (SignUpContainer старого фронта): почта, пароль (не короче 6
 * символов и с цифрой), согласие на рассылку (по умолчанию стоит, решение
 * владельца 29.10.2026), вход через VK и Яндекс ID. После регистрации — страница
 * «Подтвердите почту»; после VK — сохранить согласие и в профиль.
 */
export function SignUpForm({ locale, signInHref, signUpHref, resetHref, privacyHref, confirmHref, profileHref, labels, yandexHint }: {
    locale: Locale;
    signInHref: string;
    /** Эта страница — сюда «Вернуться» после ошибки Яндекс ID */
    signUpHref?: string;
    /** Включён ли Яндекс ID (при рендере страницы, lib/oauthProvidersServer) */
    yandexHint?: OAuthProvider | null;
    resetHref: string;
    privacyHref: string;
    confirmHref: string;
    profileHref: string;
    labels: SignUpLabels;
}) {
    // Поля и галочка неконтролируемые, значения берутся из них при отправке: введённое
    // до загрузки скриптов не стирается гидратацией (как у входа, GS-335)
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const consentRef = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState<string>();
    const [duplicate, setDuplicate] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    // До гидратации кнопка выключена: иначе браузер сам отправит форму и введённое пропадёт
    const ready = useHydrated();
    const wording = `${labels.consent}. ${labels.consentHint}`;
    // Запомнить вакансию, с которой пришли: вход через VK вернёт сюда без параметров
    useEffect(() => {
        returnAfterAuth(localePrefix(locale));
    }, [locale]);
    // Галочку сняли до загрузки скриптов — onChange не было, запомнить для входа через VK
    useEffect(() => {
        if (consentRef.current && !consentRef.current.checked) writeConsent(false);
    }, []);
    const consentGiven = () => consentRef.current?.checked ?? true;

    const afterVk = useCallback(async () => {
        const agreed = readConsent();
        writeConsent(null);
        if (agreed) await saveRegistrationConsent(wording);
        goAfterAuth(afterAuthTarget(locale, profileHref));
    }, [locale, profileHref, wording]);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = emailRef.current?.value ?? "";
        const password = passwordRef.current?.value ?? "";
        const consent = consentGiven();
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
                    // Вакансия, с которой пришли: письмо-подтверждение вернёт к ней (gs-backend #524)
                    returnPath: returnAfterAuth(localePrefix(locale)) ?? undefined,
                    ...(consent ? { marketingConsentWording: wording } : {}),
                }),
            });
            if (response.ok) {
                storageSet(REGISTER_EMAIL_KEY, email, "session");
                reachGoalThen("signup", undefined, () => {
                    window.location.href = confirmHref;
                });
                return;
            }
            const isDuplicate = response.status === 422;
            setDuplicate(isDuplicate);
            setToast(isDuplicate ? labels.duplicate : labels.invalid);
        } catch {
            setToast(labels.invalid);
        } finally {
            setBusy(false);
            if (passwordRef.current) passwordRef.current.value = "";
        }
    };

    return (
        <div className="flex w-full flex-col items-center">
            <AuthToast text={toast} onClose={() => setToast(null)} />
            <form onSubmit={submit} method="post" noValidate className="flex w-full max-w-[400px] flex-col">
                {duplicate && (
                    <div className="mt-2 text-[14px] text-caption">
                        {labels.maybeRegistered}{" "}
                        <a href={signInHref} onClick={(event) => keepReturn(event, signInHref)}>{labels.signIn}</a>{" / "}<a href={resetHref}>{labels.forgot}</a>
                    </div>
                )}
                <AuthInput label="E-mail" type="email" autoComplete="email" inputRef={emailRef} />
                <AuthInput label={labels.password} type="password" autoComplete="new-password" error={passwordError} inputRef={passwordRef} />
                <label className="flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        ref={consentRef}
                        defaultChecked
                        onChange={(event) => writeConsent(event.target.checked)}
                        className="relative h-[22px] w-[22px] shrink-0 cursor-pointer appearance-none rounded-[2px] border border-[#82949F] outline-none checked:bg-[url(/web/icons/auth/check.svg)] checked:bg-center checked:bg-no-repeat"
                    />
                    <span className="ml-2.5 leading-[138%] text-[#0e1d27] opacity-50">{labels.consent}</span>
                </label>
                <p className="mt-1 ml-8 text-[13px] leading-[1.4] text-caption">{labels.consentHint}</p>
                <button
                    type="submit"
                    disabled={busy || !ready}
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
            {labels.yandex && signUpHref && (
                <YandexIdButton
                    hint={yandexHint}
                    locale={locale}
                    label={labels.yandex.label}
                    unavailable={labels.yandex.unavailable}
                    returnTo={() => afterAuthTarget(locale, profileHref)}
                    backTo={signUpHref}
                    // Согласие на рассылку с этой страницы сохранится после входа (как у VK, GS-203)
                    consentWording={() => (consentGiven() ? wording : undefined)}
                    onError={setToast}
                />
            )}
            <p className="mt-5 text-[0.875rem] font-medium text-ink-secondary opacity-50 max-[667px]:hidden">{labels.noPosting}</p>
        </div>
    );
}
