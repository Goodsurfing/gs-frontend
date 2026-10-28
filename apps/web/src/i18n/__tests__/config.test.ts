import { describe, expect, it } from "vitest";

import { withLocale } from "../config";

describe("withLocale", () => {
    it("меняет язык в начале адреса", () => {
        expect(withLocale("/ru/offers/12", "en")).toBe("/en/offers/12");
        expect(withLocale("/es", "ru")).toBe("/ru");
    });

    it("не трогает похожие сегменты", () => {
        expect(withLocale("/russia/ru", "en")).toBe("/en/russia/ru");
        expect(withLocale("/ru-blog", "es")).toBe("/es/ru-blog");
    });

    it("добавляет язык к адресу без него", () => {
        expect(withLocale("/", "en")).toBe("/en");
    });
});
