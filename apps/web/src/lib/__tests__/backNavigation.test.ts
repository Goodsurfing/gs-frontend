import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { canGoBackTo, previousPage, recordPage } from "@/lib/backNavigation";

/** sessionStorage вкладки — в node его нет, подставляем простую замену */
const memoryStorage = () => {
    const data = new Map<string, string>();
    return {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => void data.set(key, value),
        removeItem: (key: string) => void data.delete(key),
    };
};

describe("стрелка «Назад» на отклике", () => {
    beforeEach(() => {
        vi.stubGlobal("window", { sessionStorage: memoryStorage(), localStorage: memoryStorage() });
    });
    afterEach(() => vi.unstubAllGlobals());

    it("помнит предыдущую страницу сайта; перезагрузка её не затирает", () => {
        expect(previousPage()).toBeNull();
        recordPage("/offers/7274");
        expect(previousPage()).toBeNull();
        recordPage("/messenger/create/7274");
        expect(previousPage()).toBe("/offers/7274");
        recordPage("/messenger/create/7274");
        expect(previousPage()).toBe("/offers/7274");
    });

    it("с карточки вакансии или другой страницы сайта — шаг назад по истории", () => {
        expect(canGoBackTo("/offers/7274", 3)).toBe(true);
        expect(canGoBackTo("/en/offers/7274", 3)).toBe(true);
        expect(canGoBackTo("/es/offers-map", 2)).toBe(true);
        expect(canGoBackTo("/favorite-offers", 5)).toBe(true);
    });

    it("пришли по ссылке извне, после входа или истории нет — на карточку вакансии", () => {
        expect(canGoBackTo(null, 5)).toBe(false);
        expect(canGoBackTo("/offers/7274", 1)).toBe(false);
        expect(canGoBackTo("/signin", 4)).toBe(false);
        expect(canGoBackTo("/en/signup", 4)).toBe(false);
        expect(canGoBackTo("/verify-email-hash/abc", 4)).toBe(false);
        expect(canGoBackTo("/messenger/create/7274", 4)).toBe(false);
        expect(canGoBackTo("//evil.example/offers", 4)).toBe(false);
    });

    it("без sessionStorage (приватный режим) — просто на карточку", () => {
        vi.stubGlobal("window", {});
        recordPage("/offers/1");
        expect(previousPage()).toBeNull();
    });
});
