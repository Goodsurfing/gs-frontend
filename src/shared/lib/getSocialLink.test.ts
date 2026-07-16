import { describe, it, expect } from "vitest";
import { getSocialLink } from "./getSocialLink";

/**
 * Регресс-тест: переход в Telegram не работал на /volunteer-personal, если
 * пользователь заполнял поле хэндлом вида "@username" (как в самом Telegram),
 * а не полным URL — href становился относительной ссылкой на текущий сайт.
 */
describe("getSocialLink", () => {
    it("converts a bare @handle to a full telegram URL", () => {
        expect(getSocialLink("@lavillahotel", "telegram")).toBe("https://t.me/lavillahotel");
    });

    it("converts a handle without @ to a full telegram URL", () => {
        expect(getSocialLink("lavillahotel", "telegram")).toBe("https://t.me/lavillahotel");
    });

    it("leaves a full URL untouched", () => {
        expect(getSocialLink("https://t.me/lavillahotel", "telegram")).toBe("https://t.me/lavillahotel");
    });

    it("normalizes a vk handle to a full vk.com URL", () => {
        expect(getSocialLink("@goodsurfing", "vk")).toBe("https://vk.com/goodsurfing");
    });

    it("returns undefined for empty or missing values", () => {
        expect(getSocialLink("", "telegram")).toBeUndefined();
        expect(getSocialLink(null, "telegram")).toBeUndefined();
        expect(getSocialLink(undefined, "telegram")).toBeUndefined();
    });
});
