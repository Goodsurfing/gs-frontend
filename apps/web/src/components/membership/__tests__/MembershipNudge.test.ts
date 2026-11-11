import { describe, expect, it } from "vitest";

import { quotaText } from "@/components/offers-map/FreeApplicationsHint";

import { NUDGE_DELAY_MS, nudgeAllowedOn, nudgeWaitMs } from "../MembershipNudge";

describe("предложение членства (GS-174, вернули 11.11.2026)", () => {
    it("не показываем на страницах членства, оплаты, входа и в админке", () => {
        for (const path of ["/membership", "/en/membership", "/payment", "/payment/success", "/es/payment/fail", "/signin", "/signup", "/admin/users"]) {
            expect(nudgeAllowedOn(path), path).toBe(false);
        }
        for (const path of ["/", "/offers-map", "/offers/123", "/en/offers-map", "/volunteer/volunteer-dashboard", "/memberships-faq"]) {
            expect(nudgeAllowedOn(path), path).toBe(true);
        }
    });

    it("через 2 минуты от начала визита, переходы между страницами отсчёт не сбрасывают", () => {
        expect(NUDGE_DELAY_MS).toBe(120_000);
        expect(nudgeWaitMs(1_000, 1_000)).toBe(120_000);
        expect(nudgeWaitMs(1_000, 91_000)).toBe(30_000);
        expect(nudgeWaitMs(1_000, 500_000)).toBe(0);
    });
});

describe("счётчик бесплатных откликов в каталоге", () => {
    const labels = { left: "Откликов осталось", more: "Нужно больше?\nОформите членство!" };

    it("у членов лимита нет — счётчик не показываем", () => {
        expect(quotaText(null, labels)).toBeNull();
    });

    it("остаток из трёх, перенос строки в подписи — пробел", () => {
        expect(quotaText(2, labels)).toEqual({ left: "Откликов осталось: 2 / 3", more: "Нужно больше? Оформите членство!" });
        expect(quotaText(-1, labels)?.left).toBe("Откликов осталось: 0 / 3");
    });
});
