import { describe, expect, it } from "vitest";
import { isCurrentPath } from "./isCurrentPath";

describe("isCurrentPath", () => {
    it("совпадение пути", () => {
        expect(isCurrentPath("/membership", "/membership")).toBe(true);
        expect(isCurrentPath("/en/membership", "/en/membership")).toBe(true);
    });

    it("хвостовой слэш, query и hash не важны", () => {
        expect(isCurrentPath("/membership/", "/membership")).toBe(true);
        expect(isCurrentPath("/membership", "/membership?from=menu#plans")).toBe(true);
        expect(isCurrentPath("/", "/")).toBe(true);
    });

    it("другой путь или язык — не текущая страница", () => {
        expect(isCurrentPath("/membership", "/npo")).toBe(false);
        expect(isCurrentPath("/en/membership", "/membership")).toBe(false);
        expect(isCurrentPath("/membership/pay", "/membership")).toBe(false);
    });

    it("внешние ссылки не считаются текущими", () => {
        expect(isCurrentPath("/", "https://expedition.goodsurfing.org/")).toBe(false);
        expect(isCurrentPath("/", "//goodsurfing.org/")).toBe(false);
    });
});
