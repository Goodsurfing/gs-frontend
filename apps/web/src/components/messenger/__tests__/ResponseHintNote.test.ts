import { describe, expect, it } from "vitest";

import { hintPeriod, hintText } from "../ResponseHintNote";

const labels = {
    from: "Гудсёрфинг",
    responsive: "Этот организатор отвечает на {{percent}} % заявок",
    period: " — обычно за {{period}}",
    hours: "{{count}} ч",
    days: "{{count}} дн.",
    slow: "Отвечает редко:",
    new: "Организатор недавно на Гудсёрфинге.",
    close: "Через {{days}} дней заявка закроется.",
};

describe("заметка после заявки (GS-247)", () => {
    it("срок ответа: до суток — часы, дальше — дни", () => {
        expect(hintPeriod(5, labels)).toBe("5 ч");
        expect(hintPeriod(0, labels)).toBe("1 ч");
        expect(hintPeriod(50, labels)).toBe("2 дн.");
    });

    it("тексты по виду организатора", () => {
        const base = { closeAfterDays: 21, similar: [] };
        expect(hintText({ ...base, kind: "responsive", answeredPercent: 80, medianReplyHours: 30 } as never, labels))
            .toBe("Этот организатор отвечает на 80 % заявок — обычно за 1 дн. Через 21 дней заявка закроется.");
        expect(hintText({ ...base, kind: "responsive", answeredPercent: 80, medianReplyHours: null } as never, labels))
            .toBe("Этот организатор отвечает на 80 % заявок. Через 21 дней заявка закроется.");
        expect(hintText({ ...base, kind: "responsive", answeredPercent: 90, medianReplyHours: 1557 } as never, labels))
            .toBe("Этот организатор отвечает на 90 % заявок. Через 21 дней заявка закроется.");
        expect(hintText({ ...base, kind: "new" } as never, labels)).toBe("Организатор недавно на Гудсёрфинге. Через 21 дней заявка закроется.");
        expect(hintText({ ...base, kind: "slow" } as never, labels)).toBe("Отвечает редко:");
        expect(hintText({ ...base, kind: null } as never, labels)).toBeNull();
    });
});
