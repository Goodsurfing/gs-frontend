"use client";

import { useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import { CHECKOUT_REASONS, type CheckoutReason } from "@/lib/checkoutFeedback";

export interface CheckoutFeedbackLabels {
    title: string;
    hint: string;
    reasons: Record<CheckoutReason, string>;
    comment: string;
    submit: string;
    thanks: string;
    error: string;
}

/**
 * «Что помешало оплатить?» (GS-260): после брошенной оплаты членства. Ответ — вошедшего
 * (paymentId) или по подписанной ссылке из письма (token). Отправка только кнопкой.
 */
export function CheckoutFeedbackForm({ paymentId, token, initialReason, labels, compact = false }: {
    paymentId?: string | null;
    token?: string;
    initialReason?: CheckoutReason | null;
    labels: CheckoutFeedbackLabels;
    compact?: boolean;
}) {
    const session = useSession();
    const [reason, setReason] = useState<CheckoutReason | null>(initialReason ?? null);
    const [comment, setComment] = useState("");
    const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

    const submit = async () => {
        if (!reason) return;
        setState("busy");
        try {
            const api = browserApi(token ? undefined : session.token);
            const { response } = token
                ? await api.POST("/api/v1/checkout-feedback/by-token", { body: { token, reason, comment: comment.trim() || null } })
                : await api.POST("/api/v1/checkout-feedback", { body: { paymentId: paymentId ?? null, reason, comment: comment.trim() || null } });
            setState(response.ok ? "done" : "error");
        } catch {
            setState("error");
        }
    };

    if (state === "done") return <p role="status" className="text-[16px] leading-[140%]">{labels.thanks}</p>;

    return (
        <fieldset className={`flex flex-col gap-3 text-left ${compact ? "" : "rounded-[10px] border border-accent-bg bg-white p-5"}`}>
            <legend className="mb-1 text-[18px] font-medium">{labels.title}</legend>
            {!compact && <p className="text-[14px] leading-[140%] text-caption">{labels.hint}</p>}
            <div className="flex flex-col gap-2">
                {CHECKOUT_REASONS.map((value) => (
                    <label key={value} className="flex cursor-pointer items-center gap-2.5 text-[15px]">
                        <input type="radio" name="checkout-reason" value={value} checked={reason === value} onChange={() => setReason(value)} className="h-[18px] w-[18px] accent-primary" />
                        {labels.reasons[value]}
                    </label>
                ))}
            </div>
            <label className="flex flex-col gap-1.5 text-[14px] text-caption">
                {labels.comment}
                <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} rows={3} className="rounded-[10px] border border-field bg-white p-3 text-[15px] text-ink outline-none focus:border-primary" />
            </label>
            {state === "error" && <p role="alert" className="text-[14px] text-error">{labels.error}</p>}
            <button type="button" disabled={!reason || state === "busy"} onClick={() => void submit()} className="w-fit cursor-pointer rounded-[10px] border border-primary bg-primary px-6 py-2.5 text-[15px] text-white transition-colors hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-50">
                {labels.submit}
            </button>
        </fieldset>
    );
}
