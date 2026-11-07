"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

import { CheckoutFeedbackForm, type CheckoutFeedbackLabels } from "./CheckoutFeedbackForm";

const HIDDEN_KEY = "gs.checkoutFeedbackHidden";

/**
 * На странице членства: если человек недавно начал оплату и не закончил (вернулся «Назад»
 * со страницы ЮKassa) — спросить, что помешало. «Скрыть» запоминается для этого платежа.
 */
export function CheckoutFeedbackPrompt({ labels, intro, hide }: { labels: CheckoutFeedbackLabels; intro: string; hide: string }) {
    const session = useSession();
    const [paymentId, setPaymentId] = useState<string | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token)
            .GET("/api/v1/checkout-feedback/pending")
            .then(({ data }) => {
                const id = data?.paymentId ?? null;
                let hidden = false;
                try {
                    hidden = id !== null && localStorage.getItem(HIDDEN_KEY) === id;
                } catch {
                    // без хранилища — показываем
                }
                if (!cancelled && id && !hidden) setPaymentId(id);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token]);

    if (!paymentId) return null;
    return (
        <section className="mx-auto mt-6 w-full max-w-[720px] px-4" aria-label={labels.title}>
            <div className="flex flex-col gap-3 rounded-[10px] bg-accent-bg p-5">
                <div className="flex items-start justify-between gap-4">
                    <p className="text-[15px] leading-[140%]">{intro}</p>
                    <button
                        type="button"
                        onClick={() => {
                            try {
                                localStorage.setItem(HIDDEN_KEY, paymentId);
                            } catch {
                                // нет хранилища — просто скрыть
                            }
                            setPaymentId(null);
                        }}
                        className="shrink-0 cursor-pointer text-[14px] text-caption hover:text-ink"
                    >
                        {hide}
                    </button>
                </div>
                <CheckoutFeedbackForm paymentId={paymentId} labels={labels} compact />
            </div>
        </section>
    );
}
