import { describe, expect, it } from "vitest";

import { WORKAWAY } from "../workawayLanding";

describe("страница «Как Workaway, но в России»", () => {
    it("сравнение — с живым числом вакансий", () => {
        expect(WORKAWAY.comparison(812)[0]?.us).toBe("Открытых вакансий: 812");
        expect(WORKAWAY.comparison(0)[0]?.us).toBe("Сотни проектов по всей стране");
    });

    it("Гудсёрфинг — НКО: в текстах нет цен и «стоит» (решение 10.11.2026)", () => {
        const text = JSON.stringify(WORKAWAY);
        expect(text).not.toMatch(/₽|\$|стоит|стоимост|цен[аы]\b|дешевле|членств|оплат/i);
    });
});
