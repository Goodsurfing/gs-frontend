import { describe, expect, it } from "vitest";
import type { TFunction } from "i18next";
import { responseStatsText } from "./responseStatsText";

const t = ((key: string, opts?: Record<string, unknown>) => `${key.replace("personalOffer.", "")}${opts ? ` ${Object.values(opts).join(",")}` : ""}`) as unknown as TFunction;

describe("responseStatsText", () => {
    it("нет статистики — ничего не показываем", () => {
        expect(responseStatsText(null, t)).toBeNull();
        expect(responseStatsText(undefined, t)).toBeNull();
    });

    it("отвечает быстро и часто: время и доля", () => {
        expect(responseStatsText({ sample: 10, answeredPercent: 80, medianReplyHours: 5 }, t))
            .toBe("Обычно отвечает в течение дня · Отвечает на N процентов заявок 80");
        expect(responseStatsText({ sample: 10, answeredPercent: 90, medianReplyHours: 0 }, t))
            .toContain("Обычно отвечает в течение часа");
        expect(responseStatsText({ sample: 10, answeredPercent: 60, medianReplyHours: 50 }, t))
            .toContain("Обычно отвечает за N дней 3");
    });

    it("отвечает редко: только доля, без времени", () => {
        expect(responseStatsText({ sample: 10, answeredPercent: 20, medianReplyHours: 2 }, t))
            .toBe("Отвечает на N процентов заявок 20");
        expect(responseStatsText({ sample: 10, answeredPercent: 70, medianReplyHours: null }, t))
            .toBe("Отвечает на N процентов заявок 70");
    });
});
