import { beforeEach, describe, expect, it } from "vitest";

import { forgetReferral, rememberReferral, storedReferral } from "@/lib/referral";

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
        globalThis.localStorage = memoryStorage();
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
        expect(localStorage.getItem("gs.ref")).toBeNull();
    });
});
