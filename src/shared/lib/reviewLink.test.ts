import { describe, expect, it } from "vitest";

import { parseReviewLink } from "./reviewLink";

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
