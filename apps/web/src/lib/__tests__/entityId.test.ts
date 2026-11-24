import { describe, expect, it } from "vitest";

import { isUuid } from "../entityId";

describe("id в адресе (GS-302)", () => {
    it("UUID — настоящий id, остальное — сразу «не найдено»", () => {
        expect(isUuid("1f10d610-4107-65e2-8c21-b942a4bb241b")).toBe(true);
        expect(isUuid("1F10D610-4107-65E2-8C21-B942A4BB241B")).toBe(true);
        expect(isUuid("99999999")).toBe(false);
        expect(isUuid("abc")).toBe(false);
        expect(isUuid("")).toBe(false);
        expect(isUuid("1f10d610-4107-65e2-8c21-b942a4bb241b/x")).toBe(false);
    });
});
