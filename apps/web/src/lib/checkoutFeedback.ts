import type { Translate } from "@/i18n/dictionary";

/** Причины брошенной оплаты (gs-backend CheckoutFeedbackService::REASONS) */
export const CHECKOUT_REASONS = ["expensive", "later", "payment_method", "unclear", "technical", "other"] as const;
export type CheckoutReason = (typeof CHECKOUT_REASONS)[number];

export function isCheckoutReason(value: unknown): value is CheckoutReason {
    return typeof value === "string" && (CHECKOUT_REASONS as readonly string[]).includes(value);
}

export function checkoutFeedbackLabels(t: Translate) {
    const k = (key: string) => t(`checkoutFeedback.${key}`);
    return {
        title: k("title"),
        hint: k("hint"),
        reasons: Object.fromEntries(CHECKOUT_REASONS.map((r) => [r, k(`reasons.${r}`)])) as Record<CheckoutReason, string>,
        comment: k("comment"),
        submit: k("submit"),
        thanks: k("thanks"),
        error: k("error"),
    };
}
