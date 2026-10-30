"use client";

import { useEffect, useState } from "react";

import { API_URL } from "@/lib/browserApi";

import { AuthToast } from "./AuthToast";
import { REGISTER_EMAIL_KEY } from "./SignUpForm";

/** Почта, на которую ушло письмо после регистрации (в старом фронте — redux register) */
export function RegisteredEmail() {
    const [email, setEmail] = useState("");
    useEffect(() => {
        // Почта из sessionStorage известна только в браузере
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEmail(window.sessionStorage.getItem(REGISTER_EMAIL_KEY) ?? "");
    }, []);
    return <span>{email}</span>;
}

/**
 * «Отправить подтверждение ещё раз» (ConfirmEmailPage старого фронта):
 * после первой отправки — минута ожидания, дальше — пять.
 */
export function ConfirmEmailResend({ labels }: { labels: { resend: string; wait: string; error: string } }) {
    const [cooldown, setCooldown] = useState(0);
    const [first, setFirst] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((value) => value - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const resend = async () => {
        const email = window.sessionStorage.getItem(REGISTER_EMAIL_KEY);
        if (!email) return;
        const response = await fetch(`${API_URL}/api/v1/email-verifications/resend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        }).catch(() => null);
        if (!response?.ok) {
            setError(labels.error);
            return;
        }
        setCooldown(first ? 60 : 300);
        setFirst(false);
    };

    const time = `${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}`;
    return (
        <>
            <AuthToast text={error} onClose={() => setError(null)} />
            <button
                type="button"
                disabled={cooldown > 0}
                onClick={resend}
                className="cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-[16px] leading-[120%] text-primary transition-all duration-300 hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-70 disabled:hover:bg-transparent disabled:hover:text-primary down-lg:w-full down-lg:px-[15px]"
            >
                {cooldown > 0 ? `${labels.wait} ${time}` : labels.resend}
            </button>
        </>
    );
}
