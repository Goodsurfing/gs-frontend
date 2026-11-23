import { describe, expect, it } from "vitest";

import { nextRoute, safeSitePath } from "@/lib/authSession";

describe("возврат после входа и регистрации", () => {
    it("готовый путь сайта из ссылки письма", () => {
        expect(nextRoute("", "/offers/7259", null)).toBe("/offers/7259");
        expect(nextRoute("/en", "/en/offers/1", null)).toBe("/en/offers/1");
    });

    it("чужие и кривые адреса — нет", () => {
        for (const bad of ["//evil.example", "https://evil.example", "offers/1", "/a\\b", "/x\"y", ""]) {
            expect(safeSitePath(bad)).toBeNull();
            expect(nextRoute("", bad, null)).toBeNull();
        }
    });

    it("старый формат next+nextId работает как раньше", () => {
        expect(nextRoute("", "offer", "5")).toBe("/offers/5");
    });
});
