import { describe, expect, it } from "vitest";

import { savedSearchSummary } from "../savedSearchSummary";

const labels = { all: "Все вакансии", from: "с {{date}}", to: "по {{date}}", days: "{{min}}–{{max}} дн.", kids: "можно с детьми", verified: "проверенные", food: "питание", housing: "жильё", paidTravel: "дорога", passed: "и прошедшие" };

describe("о чём подписка", () => {
    it("без фильтров — «Все вакансии»", () => {
        expect(savedSearchSummary("", {}, labels)).toEqual(["Все вакансии"]);
    });
    it("фильтры — короткими метками, направления по названию", () => {
        expect(savedSearchSummary("search=Алтай&category=3,99&from=2027-06-01&kids=1&provided=food&minDays=7", { 3: "Работа на ферме" }, labels))
            .toEqual(["«Алтай»", "Работа на ферме", "с 01.06.2027", "7–∞ дн.", "можно с детьми", "питание"]);
    });
});
