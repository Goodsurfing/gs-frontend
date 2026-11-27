"use client";

import { useEffect, useState } from "react";

import { reachGoalOnce } from "@/components/analytics/YandexMetrika";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { browserApi } from "@/lib/browserApi";

import { DuoPanel } from "./DuoPanel";
import type { DuoLabels } from "./duo";

const POLL_INTERVAL_MS = 3000;
/** Через сколько показать «Если вы вышли из оплаты — попробовать ещё раз» (опрос при этом продолжается) */
const SLOW_MS = 6000;
const POLL_TIMEOUT_MS = 60_000;
const FAIL_STATUSES = new Set(["CANCELLED", "FAILED", "REFUNDED"]);

type Kind = "volunteer" | "host" | "international";

export interface SuccessTexts {
    title: string;
    subtitle: string;
    benefits: string[];
    cta: string;
    ctaHref: string;
    callToAction: string;
}

export interface SuccessLabels {
    kinds: Record<Kind, SuccessTexts>;
    user: string;
    available: string;
    international: string;
    allFeatures: string;
    verifiedMark: string;
    processing: string;
    processingText: string;
    toMembership: string;
    /** Пока ждём подтверждения: «Проверяем оплату…», подсказка, «вышли из оплаты?» и «Попробовать ещё раз» */
    checking: string;
    checkingText: string;
    exited: string;
    retry: string;
}

const blueButton = "flex items-center justify-center rounded-[10px] border border-primary bg-primary px-[70px] py-4 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary";

/**
 * Возврат с ЮKassa после оплаты членства (PaymentSuccessPage старого
 * фронта). Ждём подтверждения ЭТОГО платежа (webhook) до минуты, опрашивая
 * статус каждые 3 секунды; отменённый — на страницу неудачи. Какой тариф
 * куплен — по самому платежу: активных членств может быть несколько.
 */
export function PaymentSuccessView({ paymentId, signInHref, failHref, membershipHref, paymentHref, duo, labels }: {
    paymentId: string | null;
    signInHref: string;
    failHref: string;
    membershipHref: string;
    /** Страница оплаты (/payment) — «Попробовать ещё раз» с тем же тарифом */
    paymentHref: string;
    /** «На двоих»: после оплаты сразу показать ссылку для второго участника */
    duo: { inviteBase: string; labels: DuoLabels };
    labels: SuccessLabels;
}) {
    const session = useSession();
    const [status, setStatus] = useState<string | null>(null);
    const [tariffCode, setTariffCode] = useState<string | null>(null);
    const [timedOut, setTimedOut] = useState(false);
    const [slow, setSlow] = useState(false);

    // Вернулись с ЮKassa по «Exit the payment process» — платёж ещё «в ожидании», ЮKassa отменит его
    // не сразу. Не держим человека перед пустым экраном (Drejk, 27.11.2026): сразу «Проверяем оплату…»,
    // а через несколько секунд — «вышли из оплаты? Попробовать ещё раз» (опрос продолжается)
    useEffect(() => {
        const timer = setTimeout(() => setSlow(true), SLOW_MS);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (session.status === "guest") window.location.replace(signInHref);
    }, [session.status, signInHref]);

    useEffect(() => {
        if (session.status !== "user") return;
        const api = browserApi(session.token);
        let stopped = false;
        const started = Date.now();
        const poll = async () => {
            if (stopped) return;
            const [payment, current] = await Promise.all([
                paymentId ? api.GET("/api/v1/payments/{id}", { params: { path: { id: paymentId } } } as never).catch(() => null) : null,
                api.GET("/api/v1/membership/current").catch(() => null),
            ]);
            if (stopped) return;
            const paid = (payment?.data ?? null) as { status?: string; tariffCode?: string | null } | null;
            const membership = (current?.data ?? null) as { tariff?: { code?: string } | null } | null;
            setTariffCode(paid?.tariffCode ?? membership?.tariff?.code ?? null);
            if (paid?.status) setStatus(paid.status);
            if (paid?.status && FAIL_STATUSES.has(paid.status)) {
                // Тариф — чтобы «Попробовать ещё раз» на странице ошибки вёл сразу к оплате того же (GS-333)
                const tariff = paid.tariffCode;
                window.location.replace(tariff ? `${failHref}&tariff=${encodeURIComponent(tariff)}` : failHref);
                return;
            }
            if (paymentId && paid?.status === "SUCCESS") reachGoalOnce("membership_paid", paymentId);
            if (!paymentId || paid?.status === "SUCCESS") return;
            if (Date.now() - started >= POLL_TIMEOUT_MS) {
                setTimedOut(true);
                return;
            }
            setTimeout(poll, POLL_INTERVAL_MS);
        };
        void poll();
        return () => {
            stopped = true;
        };
    }, [session.status, session.token, paymentId, failHref]);

    const confirmed = !paymentId || status === "SUCCESS";
    if (session.status !== "user" || (!confirmed && !timedOut)) {
        const retryHref = tariffCode ? `${paymentHref}?tariff=${encodeURIComponent(tariffCode)}` : membershipHref;
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-8 down-xs:px-4">
                <div className="flex max-w-[560px] flex-col items-center text-center">
                    <Loading label={labels.checking} className="min-h-0" />
                    <h1 className="mt-6 text-[1.5rem] font-bold text-[#333]">{labels.checking}</h1>
                    <p className="mt-2 text-[1rem] text-caption">{labels.checkingText}</p>
                    {slow && (
                        <div role="status" className="mt-8 flex w-full flex-col items-center gap-4 rounded-[14px] bg-field p-5">
                            <p className="text-[1rem] text-[#333]">{labels.exited}</p>
                            <div className="flex w-full flex-wrap justify-center gap-3">
                                <a href={retryHref} className="flex items-center justify-center rounded-[10px] border border-cta bg-cta px-8 py-3 text-center text-[16px] text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta down-xs:w-full">{labels.retry}</a>
                                <a href={membershipHref} className="flex items-center justify-center rounded-[10px] border border-primary px-8 py-3 text-center text-[16px] text-primary no-underline transition-all duration-300 hover:bg-primary hover:text-white down-xs:w-full">{labels.toMembership}</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!confirmed) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-8">
                <div className="max-w-[800px] text-center">
                    <h1 className="mb-4 text-[2rem] font-bold text-[#333]">{labels.processing}</h1>
                    <p className="mb-8 text-[1.5rem] text-[#333]">{labels.processingText}</p>
                    <div className="mt-8 flex justify-center"><a href={membershipHref} className={blueButton}>{labels.toMembership}</a></div>
                </div>
            </div>
        );
    }

    const kind: Kind = tariffCode === "international_5000" ? "international" : tariffCode === "host_4990" ? "host" : "volunteer";
    const texts = labels.kinds[kind];
    const profile = session.profile as { firstName?: string | null; email?: string | null } | null;
    const name = profile?.firstName || profile?.email || labels.user;

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
            <div className="max-w-[800px] text-center">
                <h1 className="mb-4 text-[2rem] font-bold text-[#333]">
                    {texts.title} <span className="text-[#1976d2]">{name}</span>{kind === "international" ? "!" : ","}
                </h1>
                <p className="mb-8 text-[1.5rem] text-[#333]">{texts.subtitle}</p>
                {tariffCode === "volunteer_duo" && <DuoPanel inviteBase={duo.inviteBase} labels={duo.labels} className="mb-8" />}
                <div className="mb-8 [&_p]:mb-4 [&_p]:text-[1.125rem] [&_p]:leading-7 [&_p]:text-[#666]">
                    {kind === "international"
                        ? <p>{labels.international}</p>
                        : <><p>{labels.allFeatures}</p><p>{labels.verifiedMark}</p></>}
                </div>
                <div className="my-12 text-left">
                    <h2 className="mb-6 text-[1.5rem] font-semibold text-[#333]">{labels.available}</h2>
                    <ul className="m-0 list-none p-0">
                        {texts.benefits.map((item) => (
                            <li key={item} className="relative mb-3 pl-6 text-[1.125rem] leading-8 text-[#333] before:absolute before:left-0 before:text-[1.25rem] before:font-bold before:text-[#4caf50] before:content-['✓']">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="my-8 text-[1.25rem] text-[#333]">{texts.callToAction}</p>
                <div className="mt-8 flex justify-center"><a href={texts.ctaHref} className={blueButton}>{texts.cta}</a></div>
            </div>
        </div>
    );
}
