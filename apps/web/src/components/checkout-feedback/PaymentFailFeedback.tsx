"use client";

import { useSearchParams } from "next/navigation";

import { useSession } from "@/components/session/SessionProvider";

import { CheckoutFeedbackForm, type CheckoutFeedbackLabels } from "./CheckoutFeedbackForm";

/** Страница «Ошибка оплаты»: вошедшему — вопрос о причине по платежу из адреса (?payment_id=) */
export function PaymentFailFeedback({ labels }: { labels: CheckoutFeedbackLabels }) {
    const paymentId = useSearchParams().get("payment_id");
    const session = useSession();
    if (session.status !== "user" || !paymentId) return null;
    return (
        <div className="mx-auto mt-10 max-w-[520px]">
            <CheckoutFeedbackForm paymentId={paymentId} labels={labels} />
        </div>
    );
}
