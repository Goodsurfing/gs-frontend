"use client";

import { useSearchParams } from "next/navigation";

import { isCheckoutReason } from "@/lib/checkoutFeedback";

import { CheckoutFeedbackForm, type CheckoutFeedbackLabels } from "./CheckoutFeedbackForm";

/** Ссылка из письма: причина уже выбрана (по нажатой ссылке), можно дописать и отправить */
export function CheckoutFeedbackByLink({ labels, invalid, membershipHref, back }: { labels: CheckoutFeedbackLabels; invalid: string; membershipHref: string; back: string }) {
    const params = useSearchParams();
    const token = params.get("token") ?? "";
    const reason = params.get("reason");
    if (!token) return <p className="text-[16px]">{invalid}</p>;
    return (
        <div className="flex flex-col gap-6">
            <CheckoutFeedbackForm token={token} initialReason={isCheckoutReason(reason) ? reason : null} labels={labels} />
            <a href={membershipHref} className="text-[15px] text-primary">{back}</a>
        </div>
    );
}
