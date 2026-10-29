import { describe, expect, it } from "vitest";

import { isSamePage } from "../currentPage";

describe("isSamePage", () => {
    it("та же страница — с префиксом языка и без, со слэшем, query и hash", () => {
        expect(isSamePage("/membership", "/membership")).toBe(true);
        expect(isSamePage("/ru/membership", "/membership")).toBe(true);
        expect(isSamePage("/en/membership/", "/en/membership?x=1#plans")).toBe(true);
        expect(isSamePage("/ru", "/")).toBe(true);
    });

    it("другая страница", () => {
        expect(isSamePage("/membership", "/npo")).toBe(false);
        expect(isSamePage("/membership/pay", "/membership")).toBe(false);
        expect(isSamePage("/", "/membership")).toBe(false);
    });

    it("внешние ссылки не бывают текущей страницей", () => {
        expect(isSamePage("/", "https://expedition.goodsurfing.org/")).toBe(false);
        expect(isSamePage("/", "//goodsurfing.org/")).toBe(false);
    });
});
