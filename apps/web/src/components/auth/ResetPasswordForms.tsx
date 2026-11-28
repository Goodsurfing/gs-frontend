"use client";

import { type FormEvent, useRef, useState } from "react";

import { useHydrated } from "@/components/ui/useHydrated";

import { API_URL } from "@/lib/browserApi";

import { AuthInput } from "./AuthInput";
import { AuthToast } from "./AuthToast";
import { apiErrorText } from "./SignInForm";

const blueButton = "flex w-full cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 down-lg:px-[15px]";

/** Восстановление пароля, шаги 1–2 (ResetPasswordContainer старого фронта): почта → «письмо отправлено» */
export function ResetPasswordRequest({ labels }: { labels: { send: string; sentBefore: string; sentAfter: string; spam: string; error: string } }) {
    // Поле неконтролируемое, кнопка — после гидратации: введённое до загрузки скриптов не пропадёт (GS-335)
    const emailRef = useRef<HTMLInputElement>(null);
    const ready = useHydrated();
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = emailRef.current?.value ?? "";
        setBusy(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/reset_password_requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setSentTo(email);
                return;
            }
            setError(apiErrorText(await response.json().catch(() => null)) || labels.error);
        } catch {
            setError(labels.error);
        } finally {
            setBusy(false);
        }
    };

    if (sentTo) {
        return (
            <div className="flex w-full max-w-[580px] flex-col items-center text-center">
                <div className="text-[1.125rem] leading-[144%] text-[#0e1d27]">
                    {labels.sentBefore} <span className="font-medium text-primary">{sentTo}</span> {labels.sentAfter}
                </div>
                <p className="mt-10 text-[0.875rem] leading-[143%] text-ink-secondary opacity-50">{labels.spam}</p>
            </div>
        );
    }
    return (
        // Ширина — как вышло у старого фронта: 359 px, уже 480 px — 269 px
        <form onSubmit={submit} method="post" className="flex w-[359px] flex-col items-center down-xs:w-[269px]">
            <AuthToast text={error} onClose={() => setError(null)} />
            <AuthInput label="E-mail" type="email" autoComplete="email" inputRef={emailRef} />
            <button type="submit" disabled={busy || !ready} className={blueButton}>{labels.send}</button>
        </form>
    );
}

/**
 * Новый пароль по ссылке из письма, ?token= (ResetPasswordThirdStep старого
 * фронта). Без токена — на главную. Пароли не совпали — сообщение на
 * странице (в старом фронте — системное окно alert).
 */
export function ResetPasswordConfirm({ token, mainHref, labels }: {
    token: string | null;
    mainHref: string;
    labels: { password: string; repeat: string; mismatch: string; send: string; error: string };
}) {
    // Поля неконтролируемые, кнопка — после гидратации (как у входа, GS-335)
    const passwordRef = useRef<HTMLInputElement>(null);
    const repeatRef = useRef<HTMLInputElement>(null);
    const ready = useHydrated();
    const [mismatch, setMismatch] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    if (!token) {
        if (typeof window !== "undefined") window.location.replace(mainHref);
        return null;
    }

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const password = passwordRef.current?.value ?? "";
        if (password !== (repeatRef.current?.value ?? "")) {
            setMismatch(true);
            return;
        }
        setMismatch(false);
        setBusy(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/password_reset/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            if (response.ok) {
                window.location.href = mainHref;
                return;
            }
            setError(apiErrorText(await response.json().catch(() => null)) || labels.error);
        } catch {
            setError(labels.error);
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit} method="post" className="flex w-full flex-col items-center">
            <AuthToast text={error} onClose={() => setError(null)} />
            <AuthInput label={labels.password} type="password" autoComplete="new-password" inputRef={passwordRef} />
            <AuthInput label={labels.repeat} type="password" autoComplete="new-password" error={mismatch ? labels.mismatch : undefined} inputRef={repeatRef} />
            <button type="submit" disabled={busy || !ready} className={blueButton}>{labels.send}</button>
        </form>
    );
}
