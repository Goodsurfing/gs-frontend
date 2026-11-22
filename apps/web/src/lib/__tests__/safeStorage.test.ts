import { afterEach, describe, expect, it, vi } from "vitest";

import { browserStorage, storageGet, storageRemove, storageSet } from "../safeStorage";

const memoryStorage = (): Storage => {
    const data = new Map<string, string>();
    return {
        get length() { return data.size; },
        clear: () => data.clear(),
        getItem: (key) => data.get(key) ?? null,
        key: (index) => [...data.keys()][index] ?? null,
        removeItem: (key) => { data.delete(key); },
        setItem: (key, value) => { data.set(key, value); },
    };
};

describe("safeStorage", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("без window (сервер) — пусто и без ошибок", () => {
        expect(browserStorage()).toBeNull();
        expect(storageGet("k")).toBeNull();
        expect(() => storageSet("k", "v")).not.toThrow();
    });

    it("работает с обычным хранилищем", () => {
        vi.stubGlobal("window", { localStorage: memoryStorage(), sessionStorage: memoryStorage() });
        storageSet("k", "v");
        expect(storageGet("k")).toBe("v");
        expect(storageGet("k", "session")).toBeNull();
        storageSet("k", "s", "session");
        expect(storageGet("k", "session")).toBe("s");
        storageRemove("k");
        expect(storageGet("k")).toBeNull();
    });

    it("не падает, если браузер отдаёт null вместо localStorage (18.11, Bugsink)", () => {
        vi.stubGlobal("window", { localStorage: null, sessionStorage: null });
        expect(browserStorage()).toBeNull();
        expect(storageGet("k")).toBeNull();
        expect(() => storageSet("k", "v")).not.toThrow();
        expect(() => storageRemove("k", "session")).not.toThrow();
    });

    it("не падает, если доступ к хранилищу запрещён", () => {
        vi.stubGlobal("window", {
            get localStorage(): Storage {
                throw new Error("SecurityError: access denied");
            },
        });
        expect(storageGet("k")).toBeNull();
        expect(() => storageSet("k", "v")).not.toThrow();
    });

    it("не падает при переполнении", () => {
        const full = memoryStorage();
        full.setItem = () => {
            throw new Error("QuotaExceededError");
        };
        vi.stubGlobal("window", { localStorage: full });
        expect(() => storageSet("k", "v")).not.toThrow();
    });
});
