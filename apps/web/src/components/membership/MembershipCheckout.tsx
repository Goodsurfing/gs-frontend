"use client";

import { useEffect, useRef, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { browserApi } from "@/lib/browserApi";

export interface CheckoutLabels {
    rubles: string;
    conversion: string;
    redirect: string;
    notRedirected: string;
    pay: string;
    error: string;
    back: string;
    noLink: string;
    linkUnavailable: string;
    alreadyActive: string;
    unavailable: string;
    createError: string;
}

const blueButton = "flex items-center justify-center rounded-[10px] border border-primary bg-primary text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white";

/**
 * Оплата членства (PaymentPage старого фронта): создаёт платёж по тарифу
 * из адреса и сразу уводит на ЮKassa; если переход не случился — кнопка
 * «Оплатить». Гость — на вход с возвратом сюда же. Уже есть членство (409)
 * — понятное сообщение, а не молчаливый возврат.
 */
export function MembershipCheckout({ tariffCode, signInHref, membershipHref, labels }: {
    tariffCode: string;
    signInHref: string;
    membershipHref: string;
    labels: CheckoutLabels;
}) {
    const session = useSession();
    const started = useRef(false);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session.status === "guest") {
            window.location.replace(signInHref);
            return;
        }
        if (session.status !== "user" || started.current) return;
        started.current = true;
        browserApi(session.token).POST("/api/v1/membership/checkout", { body: { tariffCode } })
            .then(({ data, error: apiError, response }) => {
                if (data?.paymentUrl) {
                    setPaymentUrl(data.paymentUrl);
                    window.location.href = data.paymentUrl;
                    return;
                }
                if (data) {
                    setError(labels.noLink);
                    return;
                }
                if (response.status === 409) {
                    setError(labels.alreadyActive);
                    return;
                }
                // 502–504 — недоступна ЮKassa; если пришла не JSON-ошибка, а страница прокси, — свой текст
                const detail = (apiError as { detail?: string; title?: string } | undefined);
                const fallback = response.status >= 502 && response.status <= 504 ? labels.unavailable : labels.createError;
                setError(detail?.detail || detail?.title || fallback);
            })
            .catch(() => setError(labels.unavailable));
    }, [session.status, session.token, tariffCode, signInHref, labels]);

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-8">
                <div className="p-8 text-center">
                    <h2 className="mb-4 text-[1.5em] font-bold text-[#d32f2f]">{labels.error}</h2>
                    <p className="mb-8 text-[#666]">{error}</p>
                    <a href={membershipHref} className={`${blueButton} px-[100px] py-3 down-lg:px-[15px]`}>{labels.back}</a>
                </div>
            </div>
        );
    }
    if (!paymentUrl) return <Loading />;
    return (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
            <div className="max-w-[600px] text-center">
                <p className="mb-6 text-[1.125rem] leading-7 text-[#333]">{labels.rubles}</p>
                <p className="mb-6 text-[1.125rem] leading-7 text-[#333]">{labels.conversion}</p>
                <p className="mb-6 text-[1.125rem] leading-7 text-[#333]">{labels.redirect} {labels.notRedirected}</p>
                <div className="mt-8 flex justify-center">
                    <button type="button" onClick={() => { window.location.href = paymentUrl; }} className={`${blueButton} cursor-pointer px-[70px] py-4`}>
                        {labels.pay}
                    </button>
                </div>
            </div>
        </div>
    );
}
