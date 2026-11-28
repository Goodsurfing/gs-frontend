import { describe, expect, it } from "vitest";

import { nextRoute, safeSitePath, signInReturningTo } from "@/lib/authSession";

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

    it("вход из закрытой страницы возвращает на неё же (ссылки из писем)", () => {
        expect(signInReturningTo("/signin", "/messenger/123")).toBe("/signin?next=%2Fmessenger%2F123");
        expect(signInReturningTo("/en/signin", "/en/messenger/123", "")).toBe("/en/signin?next=%2Fen%2Fmessenger%2F123");
        expect(signInReturningTo("/es/signin", "/es/host/notes", "?status=new&page=2"))
            .toBe("/es/signin?next=%2Fes%2Fhost%2Fnotes%3Fstatus%3Dnew%26page%3D2");
        expect(signInReturningTo("/signin", "/messenger/create", "?recipientVolunteer=a+b")).toBe("/signin?next=%2Fmessenger%2Fcreate%3FrecipientVolunteer%3Da%2Bb");
        expect(signInReturningTo("/signin", "/host/notes", "?")).toBe("/signin?next=%2Fhost%2Fnotes");
        // Адрес входа разбирается обратно в тот же путь
        const href = signInReturningTo("/signin", "/messenger/5", "?x=1");
        expect(nextRoute("", new URL(href, "https://x.test").searchParams.get("next"), null)).toBe("/messenger/5?x=1");
    });

    it("в возврат не попадает чужой домен — тогда обычный вход", () => {
        expect(signInReturningTo("/signin", "//evil.example/x")).toBe("/signin");
        expect(signInReturningTo("/signin", "/a\\b")).toBe("/signin");
        expect(signInReturningTo("/signin", "/x", "?u=https://evil.example")).toBe("/signin");
        expect(signInReturningTo("/signin", "/" + "a".repeat(400))).toBe("/signin");
    });
});
