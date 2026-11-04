import { describe, expect, it } from "vitest";

import { pageKey } from "@/components/analytics/YandexMetrika";

describe("просмотры Метрики", () => {
    it("выбор вакансии на карте — не новая страница", () => {
        expect(pageKey("https://goodsurfing.org/offers-map?category=14&offerId=7252"))
            .toBe(pageKey("https://goodsurfing.org/offers-map?category=14"));
    });

    it("смена фильтра и страницы — новая страница", () => {
        expect(pageKey("https://goodsurfing.org/offers-map?category=14")).not.toBe(pageKey("https://goodsurfing.org/offers-map?category=10"));
        expect(pageKey("https://goodsurfing.org/offers/1")).not.toBe(pageKey("https://goodsurfing.org/offers/2"));
    });
});
