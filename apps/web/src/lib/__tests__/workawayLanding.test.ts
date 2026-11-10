import { describe, expect, it } from "vitest";

import { WORKAWAY } from "../workawayLanding";

describe("страница «Как Workaway, но в России»", () => {
    it("сравнение — с живым числом вакансий и ценой из тарифов", () => {
        const rows = WORKAWAY.comparison(812, 990);
        expect(rows[0]?.us).toBe("Открытых вакансий: 812");
        expect(rows[1]?.us).toContain("990 ₽");
        expect(WORKAWAY.comparison(0, 990)[0]?.us).toBe("Сотни проектов по всей стране");
    });

    it("цена в ответах FAQ — та же, что в тарифах", () => {
        expect(WORKAWAY.faq(1190).filter((item) => item.a.includes("1190 ₽"))).toHaveLength(2);
    });
});
