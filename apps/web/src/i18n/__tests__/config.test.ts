import { describe, expect, it } from "vitest";

import { localeFromPath, localePrefix, stripLocale, withLocale } from "../config";

describe("адреса и язык", () => {
    it("у русского префикса нет", () => {
        expect(localePrefix("ru")).toBe("");
        expect(localePrefix("en")).toBe("/en");
    });

    it("язык по адресу", () => {
        expect(localeFromPath("/payment-security-policy")).toBe("ru");
        expect(localeFromPath("/")).toBe("ru");
        expect(localeFromPath("/en/rules")).toBe("en");
        expect(localeFromPath("/english")).toBe("ru");
    });

    it("смена языка у текущего адреса", () => {
        expect(withLocale("/offers/12", "en")).toBe("/en/offers/12");
        expect(withLocale("/en/offers/12", "ru")).toBe("/offers/12");
        expect(withLocale("/es", "ru")).toBe("/");
        expect(withLocale("/", "en")).toBe("/en");
    });

    it("не трогает похожие сегменты", () => {
        expect(withLocale("/russia/ru", "en")).toBe("/en/russia/ru");
        expect(withLocale("/english-club", "es")).toBe("/es/english-club");
    });

    it("устаревший /ru снимается", () => {
        expect(stripLocale("/ru/rules")).toBe("/rules");
        expect(stripLocale("/ru")).toBe("/");
    });
});
