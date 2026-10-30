"use client";

import { useEffect, useRef, useState } from "react";

import { Loading } from "@/components/ui/Loading";
import { API_URL } from "@/lib/browserApi";
import { saveSession, type TokenResponse } from "@/lib/authSession";

import { AuthMessage, outlinedLink } from "./AuthMessage";

/**
 * Ссылка из письма «Подтвердите почту» (/verify-email-hash/:hash,
 * VerifyEmailHashPage старого фронта): бэкенд подтверждает почту и
 * сразу выдаёт вход — пользователь попадает в профиль уже вошедшим.
 */
export function VerifyEmailHash({ hash, profileHref, labels }: {
    hash: string;
    profileHref: string;
    labels: { title: string; before: string; after: string; toProfile: string };
}) {
    const [loading, setLoading] = useState(true);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const token = JSON.parse(window.localStorage.getItem("token") ?? "null") as string | null;
        fetch(`${API_URL}/api/v1/verify/email/${encodeURIComponent(hash)}`, {
            credentials: "include",
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
            .then(async (response) => {
                if (!response.ok) return;
                const data = await response.json() as TokenResponse;
                if (data.accessToken) saveSession({ ...data, roles: data.roles ?? ["ROLE_USER"] }, "");
            })
            .catch(() => undefined)
            .finally(() => setLoading(false));
    }, [hash]);

    if (loading) return <Loading />;
    // Как в старом фронте: и при ошибке — то же сообщение (страница ошибок у бэкенда своя — /confirm-error)
    return (
        <AuthMessage title={labels.title} action={<a href={profileHref} className={outlinedLink}>{labels.toProfile}</a>}>
            {labels.before} <span>email</span> {labels.after}
        </AuthMessage>
    );
}
