import { describe, expect, it } from "vitest";

import {
    isLegacyRuPath, localeFromPath, localePrefix, stripLocale, withLocalePath,
} from "./localePath";

describe("localePath", () => {
    it("у русского префикса нет, у en/es есть", () => {
        expect(localePrefix("ru")).toBe("");
        expect(localePrefix("en")).toBe("/en");
        expect(localePrefix("es")).toBe("/es");
    });

    it("язык по адресу", () => {
        expect(localeFromPath("/offers-map")).toBe("ru");
        expect(localeFromPath("/")).toBe("ru");
        expect(localeFromPath("/en/offers-map")).toBe("en");
        expect(localeFromPath("/es")).toBe("es");
        expect(localeFromPath("/english-club")).toBe("ru");
    });

    it("смена языка у текущего адреса", () => {
        expect(withLocalePath("/blog/a", "en")).toBe("/en/blog/a");
        expect(withLocalePath("/en/blog/a", "ru")).toBe("/blog/a");
        expect(withLocalePath("/en/blog/a", "es")).toBe("/es/blog/a");
        expect(withLocalePath("/", "en")).toBe("/en/");
        expect(withLocalePath("/en/", "ru")).toBe("/");
        expect(withLocalePath("/ru/blog", "ru")).toBe("/blog");
    });

    it("устаревший /ru", () => {
        expect(isLegacyRuPath("/ru")).toBe(true);
        expect(isLegacyRuPath("/ru/offers-map")).toBe(true);
        expect(isLegacyRuPath("/rules")).toBe(false);
        expect(stripLocale("/ru")).toBe("/");
    });
});
