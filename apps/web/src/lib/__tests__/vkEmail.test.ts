import { describe, expect, it } from "vitest";

import { isHiddenAt, isPlaceholderEmail, VK_EMAIL_HIDE_MS } from "../vkEmail";

describe("почта-заглушка после входа через VK", () => {
    it("узнаёт заглушки VK и старые tmp", () => {
        expect(isPlaceholderEmail("123456@vkontakte.ru")).toBe(true);
        expect(isPlaceholderEmail(" 42@VKONTAKTE.RU ")).toBe(true);
        expect(isPlaceholderEmail("user@tmp.tmp")).toBe(true);
    });

    it("настоящие адреса — не заглушки", () => {
        expect(isPlaceholderEmail("anna@mail.ru")).toBe(false);
        expect(isPlaceholderEmail("vkontakte.ru@gmail.com")).toBe(false);
        expect(isPlaceholderEmail("")).toBe(false);
        expect(isPlaceholderEmail(null)).toBe(false);
    });

    it("«Позже» прячет на 3 дня", () => {
        const now = 1_800_000_000_000;
        expect(isHiddenAt(null, now)).toBe(false);
        expect(isHiddenAt("мусор", now)).toBe(false);
        expect(isHiddenAt(String(now - 1000), now)).toBe(true);
        expect(isHiddenAt(String(now - VK_EMAIL_HIDE_MS - 1), now)).toBe(false);
    });
});
