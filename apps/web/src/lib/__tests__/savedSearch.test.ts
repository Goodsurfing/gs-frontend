import { describe, expect, it } from "vitest";

import { nextRoute } from "@/lib/authSession";
import { parseOffersFilters } from "@/lib/offersFilters";
import { parseSubscribeSource, savedSearchFilters, subscribeReturnQuery } from "@/lib/savedSearch";

describe("подписка на подборку", () => {
    const filters = parseOffersFilters(new URLSearchParams("category=14,3&from=2027-06-01&kids=1&provided=food&past=0&page=3&offerId=7"));

    it("фильтры карты — в параметрах API без «[]»", () => {
        expect(savedSearchFilters(filters)).toEqual({
            categoryIds: [14, 3],
            startDate: "2027-06-01",
            additionalConditions: ["allow-kids"],
            foodIds: [1, 2, 3],
            hidePassed: true,
        });
    });

    it("после входа — обратно на карту с теми же фильтрами и предложением подписаться", () => {
        const query = subscribeReturnQuery(filters, "empty");
        expect(query).not.toContain("page=");
        expect(query).not.toContain("offerId=");
        const back = nextRoute("", "offersMap", query);
        expect(back).toBe(`/offers-map?${query}`);
        expect(back).toContain("subscribe=empty");
        expect(nextRoute("/en", "offersMap", "category=1")).toBe("/en/offers-map?category=1");
    });

    it("источник из адреса", () => {
        expect(parseSubscribeSource("email")).toBe("email");
        expect(parseSubscribeSource("1")).toBe("button");
        expect(parseSubscribeSource("evil")).toBeNull();
        expect(parseSubscribeSource(undefined)).toBeNull();
    });
});
