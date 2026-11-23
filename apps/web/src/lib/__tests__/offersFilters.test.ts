import { describe, expect, it } from "vitest";

import { offersApiQuery, offersFiltersQuery, parseOffersFilters } from "../offersFilters";

describe("фильтры каталога вакансий", () => {
    it("старые ссылки работают: category через запятую, search, page, offerId", () => {
        const filters = parseOffersFilters({ category: "13,4", search: "Байкал", page: "3", offerId: "7243" });
        expect(filters.categories).toEqual([13, 4]);
        expect(filters.search).toBe("Байкал");
        expect(filters.page).toBe(3);
        expect(filters.offerId).toBe(7243);
        expect(filters.showPassed).toBe(false);
        expect(filters.sort).toBe("novelty");
    });

    it("прошедшие по умолчанию скрыты; past=1 — показать, старые ссылки с past=0 — скрыть", () => {
        expect(parseOffersFilters({}).showPassed).toBe(false);
        expect(offersApiQuery(parseOffersFilters({})).hidePassed).toBe(true);
        expect(parseOffersFilters({ past: "1" }).showPassed).toBe(true);
        expect(offersApiQuery(parseOffersFilters({ past: "1" })).hidePassed).toBeUndefined();
        expect(parseOffersFilters({ past: "0" }).showPassed).toBe(false);
        expect(offersFiltersQuery(parseOffersFilters({ past: "0" }))).toBe("");
    });

    it("мусор в адресе не ломает фильтры", () => {
        const filters = parseOffersFilters({ category: "abc,0,-1,5", page: "-2", from: "вчера", provided: "food,spa", minDays: "1", maxDays: "190" });
        expect(filters.categories).toEqual([5]);
        expect(filters.page).toBe(1);
        expect(filters.from).toBeUndefined();
        expect(filters.provided).toEqual(["food"]);
        // Края ползунка 1–190 — это «не задано», как в старом фронте
        expect(filters.minDays).toBeUndefined();
        expect(filters.maxDays).toBeUndefined();
    });

    it("адрес и разбор — взаимно обратны, значения по умолчанию не пишутся", () => {
        expect(offersFiltersQuery(parseOffersFilters({}))).toBe("");
        const query = "category=1%2C2&search=sea&sort=popularity&past=1&from=2026-11-01&to=2026-12-01&minDays=7&maxDays=30&lang=en&kids=1&verified=1&provided=food%2Chousing&page=2";
        expect(offersFiltersQuery(parseOffersFilters(new URLSearchParams(query)))).toBe(query);
    });

    it("параметры API — как offersFilterApiAdapter старого фронта", () => {
        const api = offersApiQuery(parseOffersFilters({ category: "3", past: "0", kids: "1", provided: "food,paidTravel", maxDays: "30" }));
        expect(api).toEqual({
            "categoryIds[]": [3],
            hidePassed: true,
            "additionalConditions[]": ["allow-kids"],
            "foodIds[]": [1, 2, 3],
            "transferIds[]": [1, 2, 3, 4],
            maxDurationDays: "30",
        });
    });

    it("GS-245: «Только верифицированные хосты» — в адресе verified=1, в API verifiedHost", () => {
        const filters = parseOffersFilters({ verified: "1" });
        expect(filters.verifiedHost).toBe(true);
        // hidePassed — умолчание каталога (прошедшие скрыты)
        expect(offersApiQuery(filters)).toEqual({ verifiedHost: true, hidePassed: true });
        expect(parseOffersFilters({}).verifiedHost).toBe(false);
        expect(offersApiQuery(parseOffersFilters({}))).toEqual({ hidePassed: true });
    });
});
