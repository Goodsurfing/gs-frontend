"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useSession } from "@/components/session/SessionProvider";

import { CheckoutFeedbackForm, type CheckoutFeedbackLabels } from "./CheckoutFeedbackForm";

/**
 * Страница «Ошибка оплаты»: вошедшему — вопрос о причине по платежу из адреса (?payment_id=).
 * Свёрнут в одну строку под «Попробовать ещё раз» (GS-333), по нажатию — варианты ответа.
 */
export function PaymentFailFeedback({ labels }: { labels: CheckoutFeedbackLabels }) {
    const paymentId = useSearchParams().get("payment_id");
    const session = useSession();
    const [open, setOpen] = useState(false);
    if (session.status !== "user" || !paymentId) return null;
    if (!open) {
        return (
            <button type="button" aria-expanded={false} onClick={() => setOpen(true)} className="mt-4 cursor-pointer text-[0.9375rem] text-caption underline hover:text-ink">
                {labels.title}
            </button>
        );
    }
    return (
        <div className="mx-auto mt-6 max-w-[520px]">
            <CheckoutFeedbackForm paymentId={paymentId} labels={labels} />
        </div>
    );
}
