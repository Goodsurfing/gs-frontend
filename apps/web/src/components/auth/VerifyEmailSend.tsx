"use client";

import { type FormEvent, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { API_URL } from "@/lib/browserApi";

import { AuthInput } from "./AuthInput";
import { AuthToast } from "./AuthToast";

/**
 * Подтверждение почты из профиля (/verify-email, VerifyEmailWidget старого
 * фронта): только вошедшему — гостя на главную; письмо можно отправить
 * повторно через минуту.
 */
export function VerifyEmailSend({ mainHref, labels }: {
    mainHref: string;
    labels: { submit: string; note: string; sent: string; resend: string; resendIn: string; error: string };
}) {
    const session = useSession();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session.status === "guest") window.location.replace(mainHref);
    }, [session.status, mainHref]);
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((value) => value - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const send = async () => {
        if (cooldown > 0 || !email) return;
        setBusy(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/send-email`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}) },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) throw new Error(String(response.status));
            setSent(true);
            setCooldown(60);
        } catch {
            setSent(false);
            setError(labels.error);
        } finally {
            setBusy(false);
        }
    };
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void send();
    };

    const button = "cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-[16px] leading-[120%] transition-all duration-300 disabled:cursor-default disabled:opacity-70 down-lg:w-full down-lg:px-[15px]";
    return (
        <div className="flex w-full max-w-[400px] flex-col items-center">
            <AuthToast text={error} onClose={() => setError(null)} />
            {sent ? (
                <>
                    <p className="mb-5 text-center">{labels.sent}</p>
                    <button type="button" onClick={() => void send()} disabled={busy || cooldown > 0} className={`${button} text-primary hover:bg-primary hover:text-white`}>
                        {cooldown > 0 ? labels.resendIn.replace("{{seconds}}", String(cooldown)) : labels.resend}
                    </button>
                </>
            ) : (
                <form onSubmit={submit} className="flex w-full flex-col">
                    <AuthInput label="E-mail" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <button type="submit" disabled={busy} className={`${button} bg-primary text-white hover:bg-white hover:text-primary`}>{labels.submit}</button>
                    <div className="mt-[30px] text-center text-[0.875rem] leading-[157%] text-caption">{labels.note}.</div>
                </form>
            )}
        </div>
    );
}
