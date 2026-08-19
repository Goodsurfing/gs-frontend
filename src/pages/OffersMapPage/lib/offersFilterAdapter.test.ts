import {
    describe, it, expect,
} from "vitest";

import { offersFilterApiAdapter } from "./offersFilterAdapter";
import { OffersFilterFields } from "../model/types";

const baseFields: OffersFilterFields = {
    offersSort: { sortValue: "novelty", showClosedOffers: true },
    periods: { start: undefined, end: undefined },
    category: [],
    participationPeriod: [1, 190],
    withChildren: false,
    languages: [],
    provided: [],
};

describe("offersFilterApiAdapter", () => {
    // Регресс: тумблер "Показать прошедшие" раньше подставлял
    // startDate=сегодня в тот же фильтр, что и явный выбор даты
    // пользователем (periods.start >= startDate) — из-за этого вакансии с
    // уже идущим (но не закончившимся) периодом ошибочно пропадали из
    // выдачи. Тумблер должен слать отдельный параметр hidePassed, не
    // трогая startDate.
    it("does not set startDate when the user hasn't picked a start date, even with hidePassed", () => {
        const result = offersFilterApiAdapter({
            ...baseFields,
            offersSort: { sortValue: "novelty", showClosedOffers: false },
        });

        expect(result.hidePassed).toBe(true);
        expect(result.startDate).toBeUndefined();
    });

    it("keeps the user's own chosen start date untouched regardless of the toggle", () => {
        const chosenStart = new Date("2026-09-01T00:00:00.000Z");

        const shown = offersFilterApiAdapter({
            ...baseFields,
            periods: { start: chosenStart, end: undefined },
            offersSort: { sortValue: "novelty", showClosedOffers: true },
        });
        const hidden = offersFilterApiAdapter({
            ...baseFields,
            periods: { start: chosenStart, end: undefined },
            offersSort: { sortValue: "novelty", showClosedOffers: false },
        });

        expect(shown.startDate).toBe(hidden.startDate);
        expect(hidden.hidePassed).toBe(true);
        expect(shown.hidePassed).toBeUndefined();
    });
});
