import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { forgetReferral, referralLink, rememberReferral, storedReferral } from "@/lib/referral";

/** Хранилище браузера в памяти — тесты идут в node */
function memoryStorage(): Storage {
    const data = new Map<string, string>();
    return {
        get length() { return data.size; },
        clear: () => data.clear(),
        getItem: (key) => data.get(key) ?? null,
        key: (index) => [...data.keys()][index] ?? null,
        removeItem: (key) => { data.delete(key); },
        setItem: (key, value) => { data.set(key, String(value)); },
    };
}

describe("код приглашения", () => {
    beforeEach(() => {
        vi.stubGlobal("window", { localStorage: memoryStorage() });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("запоминает код из адреса и отдаёт его", () => {
        rememberReferral("?utm_source=vk&ref=K7M2XQ9P", 1000);
        expect(storedReferral(2000)).toBe("k7m2xq9p");
        forgetReferral();
        expect(storedReferral(2000)).toBeNull();
    });

    it("мусор в ref не сохраняет", () => {
        rememberReferral("?ref=<script>", 1000);
        rememberReferral("?ref=", 1000);
        expect(storedReferral(2000)).toBeNull();
    });

    it("старше 30 дней — забывает", () => {
        rememberReferral("?ref=abcd2345", 0);
        expect(storedReferral(31 * 24 * 60 * 60 * 1000)).toBeNull();
        expect(window.localStorage.getItem("gs.ref")).toBeNull();
    });
});

describe("ссылка-приглашение", () => {
    it("на языке сайта, а не профиля", () => {
        expect(referralLink("https://goodsurfing.org", "ru", "k7m2xq9p")).toBe("https://goodsurfing.org/?ref=k7m2xq9p");
        expect(referralLink("https://goodsurfing.org/", "en", "k7m2xq9p")).toBe("https://goodsurfing.org/en?ref=k7m2xq9p");
        expect(referralLink("https://staging.goodsurfing.org", "es", "k7m2xq9p")).toBe("https://staging.goodsurfing.org/es?ref=k7m2xq9p");
    });
});
