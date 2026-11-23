import { describe, expect, it } from "vitest";

import { reviewDate } from "../OfferReviews";

describe("дата отзыва", () => {
    it("день из ISO без сдвига часового пояса, на языке страницы", () => {
        expect(reviewDate("2026-03-04T23:30:00+00:00", "ru")).toBe("4 марта 2026");
        expect(reviewDate("2026-03-04T07:38:07+00:00", "en")).toBe("March 4, 2026");
        expect(reviewDate("2026-03-04T07:38:07+00:00", "es")).toBe("4 de marzo de 2026");
        expect(reviewDate(null, "ru")).toBe("");
    });
});
