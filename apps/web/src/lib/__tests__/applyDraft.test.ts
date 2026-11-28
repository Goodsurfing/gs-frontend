import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApplyDates } from "../applyDates";
import {
    APPLY_DRAFT_TTL_MS, clearAllApplyDrafts, clearApplyDraft, clearApplyReturn, draftTerms, loadApplyDraft, markApplyReturn,
    membershipRequired, pruneApplyDrafts, readApplyReturn, saveApplyDraft,
} from "../applyDraft";

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

const NOW = 1_764_300_000_000;
let storage: Storage;

describe("черновик отклика (GS-341)", () => {
    beforeEach(() => {
        storage = memoryStorage();
        vi.stubGlobal("window", { localStorage: storage, sessionStorage: memoryStorage() });
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("сохраняет и восстанавливает даты и текст по пользователю и вакансии", () => {
        saveApplyDraft("u1", "7274", { start: "2026-12-10", end: "2026-12-20", message: "Умею с лошадьми" }, NOW);
        expect(loadApplyDraft("u1", "7274", NOW + 1000)).toEqual({ start: "2026-12-10", end: "2026-12-20", message: "Умею с лошадьми", savedAt: NOW });
    });

    it("другой аккаунт и другая вакансия черновик не видят", () => {
        saveApplyDraft("u1", "7274", { start: "2026-12-10", end: "2026-12-20", message: "Секрет" }, NOW);
        expect(loadApplyDraft("u2", "7274", NOW)).toBeNull();
        expect(loadApplyDraft("u1", "7275", NOW)).toBeNull();
    });

    it("просроченный черновик не отдаётся и удаляется", () => {
        saveApplyDraft("u1", "7274", { start: null, end: null, message: "Старое" }, NOW);
        expect(loadApplyDraft("u1", "7274", NOW + APPLY_DRAFT_TTL_MS)).toBeNull();
        expect(storage.length).toBe(0);
    });

    it("битые данные в хранилище не ломают форму", () => {
        storage.setItem("gs.applyDraft.u1.7274", "{не json");
        expect(loadApplyDraft("u1", "7274", NOW)).toBeNull();
        storage.setItem("gs.applyDraft.u1.7274", JSON.stringify({ start: "10.12.2026", end: 5, message: 42, savedAt: NOW }));
        expect(loadApplyDraft("u1", "7274", NOW)).toEqual({ start: null, end: null, message: "", savedAt: NOW });
    });

    it("текст обрезается до предела сообщения", () => {
        saveApplyDraft("u1", "1", { start: null, end: null, message: "я".repeat(1500) }, NOW);
        expect(loadApplyDraft("u1", "1", NOW)!.message).toHaveLength(1000);
    });

    it("после отправки черновик удаляется", () => {
        saveApplyDraft("u1", "7274", { start: null, end: null, message: "Текст" }, NOW);
        clearApplyDraft("u1", "7274");
        expect(loadApplyDraft("u1", "7274", NOW)).toBeNull();
    });

    it("уборка удаляет только просроченные черновики", () => {
        saveApplyDraft("u1", "1", { start: null, end: null, message: "старый" }, NOW - APPLY_DRAFT_TTL_MS - 1);
        saveApplyDraft("u1", "2", { start: null, end: null, message: "свежий" }, NOW);
        storage.setItem("token", "\"не трогать\"");
        pruneApplyDrafts(NOW);
        expect(loadApplyDraft("u1", "1", NOW)).toBeNull();
        expect(loadApplyDraft("u1", "2", NOW)?.message).toBe("свежий");
        expect(storage.getItem("token")).toBe("\"не трогать\"");
    });

    it("выход из аккаунта удаляет все черновики и отметку возврата", () => {
        saveApplyDraft("u1", "1", { start: null, end: null, message: "a" }, NOW);
        saveApplyDraft("u2", "2", { start: null, end: null, message: "b" }, NOW);
        markApplyReturn({ userId: "u1", offerId: "1", title: "Ферма" }, NOW);
        storage.setItem("token", "x");
        clearAllApplyDrafts();
        expect(storage.length).toBe(1);
        expect(storage.getItem("token")).toBe("x");
    });

    it("без хранилища (приватный режим) ничего не падает", () => {
        vi.stubGlobal("window", { get localStorage(): Storage { throw new Error("denied"); } });
        expect(() => saveApplyDraft("u1", "1", { start: null, end: null, message: "a" }, NOW)).not.toThrow();
        expect(loadApplyDraft("u1", "1", NOW)).toBeNull();
        expect(() => clearAllApplyDrafts()).not.toThrow();
    });
});

describe("возврат к отклику после оплаты (GS-341)", () => {
    beforeEach(() => {
        storage = memoryStorage();
        vi.stubGlobal("window", { localStorage: storage, sessionStorage: memoryStorage() });
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("отметка отдаётся только своему пользователю и пока не истекла", () => {
        markApplyReturn({ userId: "u1", offerId: "7274", title: "Ферма в Карелии" }, NOW);
        expect(readApplyReturn("u1", NOW + 60_000)).toEqual({ userId: "u1", offerId: "7274", title: "Ферма в Карелии", at: NOW });
        expect(readApplyReturn("u2", NOW)).toBeNull();
        expect(readApplyReturn(null, NOW)).toBeNull();
        expect(readApplyReturn("u1", NOW + APPLY_DRAFT_TTL_MS)).toBeNull();
    });

    it("в отметке только номер вакансии — никаких адресов", () => {
        storage.setItem("gs.applyReturn", JSON.stringify({ userId: "u1", offerId: "//evil.example", title: "", at: NOW }));
        expect(readApplyReturn("u1", NOW)).toBeNull();
    });

    it("отправили отклик на эту вакансию — отметка удаляется, на другую — остаётся", () => {
        markApplyReturn({ userId: "u1", offerId: "7274", title: "" }, NOW);
        clearApplyReturn("1");
        expect(readApplyReturn("u1", NOW)).not.toBeNull();
        clearApplyReturn("7274");
        expect(readApplyReturn("u1", NOW)).toBeNull();
    });
});

describe("даты из черновика", () => {
    const periods: ApplyDates = {
        kind: "periods",
        minDays: 0,
        periods: [
            { start: "2026-12-10", end: "2026-12-20", window: false },
            { start: "2027-01-01", end: "2027-03-31", window: true },
        ],
    };

    it("подходят периоду организатора — восстанавливаются", () => {
        expect(draftTerms({ start: "2026-12-10", end: "2026-12-20" }, periods, "2026-11-28")).toEqual({ start: "2026-12-10", end: "2026-12-20" });
        expect(draftTerms({ start: "2027-01-05", end: "2027-01-20" }, periods, "2026-11-28")).toEqual({ start: "2027-01-05", end: "2027-01-20" });
    });

    it("период пропал или даты в прошлом — не восстанавливаются", () => {
        expect(draftTerms({ start: "2026-12-11", end: "2026-12-20" }, periods, "2026-11-28")).toBeNull();
        expect(draftTerms({ start: "2026-12-10", end: "2026-12-20" }, periods, "2026-12-11")).toBeNull();
        expect(draftTerms({ start: null, end: "2026-12-20" }, periods, "2026-11-28")).toBeNull();
    });

    it("без периодов — любые будущие даты", () => {
        const free: ApplyDates = { kind: "free", suggestion: { start: "2026-12-05", end: "2026-12-18" } };
        expect(draftTerms({ start: "2027-02-01", end: "2027-02-10" }, free, "2026-11-28")).toEqual({ start: "2027-02-01", end: "2027-02-10" });
        expect(draftTerms({ start: "2027-02-10", end: "2027-02-01" }, free, "2026-11-28")).toBeNull();
    });
});

describe("опознание «нужно членство» в ответе API", () => {
    it("лимит бесплатных откликов", () => {
        expect(membershipRequired({ type: "application_limit_exceeded", status: 403, detail: "Free account allows up to 3 applications." })).toBe("limit");
        expect(membershipRequired({ errorCode: "application_limit_exceeded" })).toBe("limit");
    });

    it("вакансия только для участников с членством", () => {
        expect(membershipRequired({ type: "only_verified_volunteers_allowed" })).toBe("verified");
    });

    it("прочие ошибки — нет", () => {
        expect(membershipRequired({ type: "application_form_already_exist" })).toBeNull();
        expect(membershipRequired({ detail: "Проверочный ответ" })).toBeNull();
        expect(membershipRequired(null)).toBeNull();
    });
});
