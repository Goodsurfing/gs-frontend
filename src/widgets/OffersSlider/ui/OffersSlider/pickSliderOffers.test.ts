import { describe, it, expect } from "vitest";
import { pickSliderOffers, SLIDER_OFFERS_LIMIT } from "./pickSliderOffers";

const makeOffers = (count: number) => Array.from({ length: count }, (_, i) => ({ id: i + 1 }));

describe("pickSliderOffers", () => {
    it("использует выбранные вакансии, если admin что-то выбрал", () => {
        const featured = makeOffers(3);
        const recommended = makeOffers(5);

        expect(pickSliderOffers(featured, recommended)).toEqual(featured);
    });

    it("падает обратно на рекомендации, если ничего не выбрано", () => {
        const recommended = makeOffers(5);

        expect(pickSliderOffers([], recommended)).toEqual(recommended);
    });

    it(`ограничивает выбранные вакансии первыми ${SLIDER_OFFERS_LIMIT}`, () => {
        const featured = makeOffers(15);

        expect(pickSliderOffers(featured, [])).toHaveLength(SLIDER_OFFERS_LIMIT);
    });

    it(`ограничивает рекомендованные вакансии первыми ${SLIDER_OFFERS_LIMIT}`, () => {
        const recommended = makeOffers(15);

        expect(pickSliderOffers([], recommended)).toHaveLength(SLIDER_OFFERS_LIMIT);
    });

    it("GS-90: персональные вакансии волонтёра важнее admin-подборки", () => {
        const personal = makeOffers(2);
        const featured = makeOffers(3);
        const recommended = makeOffers(5);

        expect(pickSliderOffers(personal, featured, recommended)).toEqual(personal);
    });

    it("GS-90: падает на admin-подборку, если у волонтёра нет персональных совпадений", () => {
        const featured = makeOffers(3);
        const recommended = makeOffers(5);

        expect(pickSliderOffers([], featured, recommended)).toEqual(featured);
    });

    it("GS-90: падает на рекомендации, если нет ни персональных, ни admin вакансий", () => {
        const recommended = makeOffers(5);

        expect(pickSliderOffers([], [], recommended)).toEqual(recommended);
    });
});
