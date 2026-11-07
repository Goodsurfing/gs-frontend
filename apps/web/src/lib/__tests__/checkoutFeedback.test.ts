import { describe, expect, it } from "vitest";

import { CHECKOUT_REASONS, checkoutFeedbackLabels, isCheckoutReason } from "@/lib/checkoutFeedback";

import ru from "../../../../../public/locales/ru/translation.json";
import en from "../../../../../public/locales/en/translation.json";
import es from "../../../../../public/locales/es/translation.json";

function translator(dict: Record<string, unknown>) {
    return (key: string) => {
        let node: unknown = dict;
        for (const part of key.split(".")) node = (node as Record<string, unknown> | undefined)?.[part];
        return typeof node === "string" ? node : key;
    };
}

describe("почему не оплатили", () => {
    it.each([["ru", ru], ["en", en], ["es", es]])("все подписи есть на %s", (_, dict) => {
        const labels = checkoutFeedbackLabels(translator(dict as Record<string, unknown>));
        const texts = [labels.title, labels.hint, labels.comment, labels.submit, labels.thanks, labels.error, ...Object.values(labels.reasons)];
        expect(texts.filter((t) => t.startsWith("checkoutFeedback."))).toEqual([]);
        expect(Object.keys(labels.reasons)).toEqual([...CHECKOUT_REASONS]);
    });

    it("причина из ссылки — только из списка", () => {
        expect(isCheckoutReason("expensive")).toBe(true);
        expect(isCheckoutReason("<script>")).toBe(false);
        expect(isCheckoutReason(null)).toBe(false);
    });
});
