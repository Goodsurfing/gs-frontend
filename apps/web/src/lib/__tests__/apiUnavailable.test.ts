import { describe, expect, it } from "vitest";

import { ApiUnavailableError, failOnApiError, isClientError } from "../apiUnavailable";

describe("кэш страниц и сбои API", () => {
    it("4xx — данных нет, а не сбой", () => {
        expect(isClientError(400)).toBe(true);
        expect(isClientError(404)).toBe(true);
        expect(isClientError(403)).toBe(true);
        expect(isClientError(500)).toBe(false);
        expect(isClientError(503)).toBe(false);
        expect(isClientError(200)).toBe(false);
    });

    it("сбой бросается, чтобы экран ошибки не попал в кэш", () => {
        expect(() => failOnApiError({ kind: "error" }, "вакансия 1")).toThrow(ApiUnavailableError);
        expect(() => failOnApiError({ kind: "notFound" }, "вакансия 1")).not.toThrow();
        expect(() => failOnApiError({ kind: "ok" }, "вакансия 1")).not.toThrow();
    });

    it("текст одинаковый для всех страниц — одна карточка в Bugsink", () => {
        const a = new ApiUnavailableError("вакансия 1");
        const b = new ApiUnavailableError("организация 2");
        expect(a.message).toBe(b.message);
        expect(a.what).toBe("вакансия 1");
    });
});
