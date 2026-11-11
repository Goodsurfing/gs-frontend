"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/** Строка счётчика: «Откликов осталось: 2 из 3 · Нужно больше? Оформите членство!» */
export function quotaText(remaining: number | null, labels: { left: string; more: string }): { left: string; more: string } | null {
    if (remaining === null) return null;
    return { left: `${labels.left}: ${Math.max(0, remaining)} / 3`, more: labels.more.replace(/\s+/g, " ") };
}

/**
 * Счётчик бесплатных откликов в каталоге (FreeApplicationsCounter старого SPA, пропал при переезде
 * 03.11.2026). Только вошедшим без членства: у членов лимита нет (remainingFreeApplications = null).
 * Ссылка — сразу к оплате членства волонтёра.
 */
export function FreeApplicationsHint({ paymentHref, labels }: { paymentHref: string; labels: { left: string; more: string } }) {
    const session = useSession();
    const [remaining, setRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token).GET("/api/v1/profile/occupancy")
            .then(({ data }) => !cancelled && data && setRemaining(data.remainingFreeApplications ?? null))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token]);

    const text = quotaText(remaining, labels);
    if (session.status !== "user" || !text) return null;
    return (
        <span className="text-[14px] text-ink-secondary" data-testid="free-applications">
            {text.left} · <a href={paymentHref} className="font-medium text-cta underline">{text.more}</a>
        </span>
    );
}
