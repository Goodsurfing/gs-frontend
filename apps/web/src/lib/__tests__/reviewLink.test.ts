import { describe, expect, it } from "vitest";

import { isReminderHidden, parseReviewLink, reviewLinkHref } from "../reviewLink";

describe("parseReviewLink", () => {
    it("волонтёр: вакансия и оценка", () => {
        expect(parseReviewLink("?vacancy=12&rating=4")).toEqual({ vacancyId: 12, volunteerId: null, rating: 4 });
    });

    it("организатор: волонтёр, вакансия и оценка", () => {
        expect(parseReviewLink("?volunteer=0190-ab&vacancy=7&rating=5")).toEqual({ vacancyId: 7, volunteerId: "0190-ab", rating: 5 });
    });

    it("без вакансии или с мусором — ничего не открывать", () => {
        expect(parseReviewLink("")).toBeNull();
        expect(parseReviewLink("?vacancy=abc&rating=5")).toBeNull();
        expect(parseReviewLink("?vacancy=-3")).toBeNull();
    });

    it("оценка вне 1–5 — окно без оценки", () => {
        expect(parseReviewLink("?vacancy=3&rating=9")?.rating).toBeNull();
        expect(parseReviewLink("?vacancy=3&rating=2.5")?.rating).toBeNull();
        expect(parseReviewLink("?vacancy=3")?.rating).toBeNull();
    });
});

describe("reviewLinkHref", () => {
    it("волонтёру — вакансия, организатору — ещё и волонтёр; разбирается обратно", () => {
        const volunteer = reviewLinkHref("/volunteer/review", { side: "volunteer", vacancyId: 5, volunteerId: "u1" });
        expect(volunteer).toBe("/volunteer/review?vacancy=5");
        const host = reviewLinkHref("/en/host/review", { side: "host", vacancyId: 5, volunteerId: "u1" });
        expect(host).toBe("/en/host/review?volunteer=u1&vacancy=5");
        expect(parseReviewLink(host.slice(host.indexOf("?")))).toEqual({ vacancyId: 5, volunteerId: "u1", rating: null });
    });
});

describe("isReminderHidden", () => {
    const day = 24 * 60 * 60 * 1000;
    it("скрыта 30 дней после «Скрыть»", () => {
        const now = 100 * day;
        expect(isReminderHidden(null, now)).toBe(false);
        expect(isReminderHidden("мусор", now)).toBe(false);
        expect(isReminderHidden(String(now - 29 * day), now)).toBe(true);
        expect(isReminderHidden(String(now - 31 * day), now)).toBe(false);
    });
});
