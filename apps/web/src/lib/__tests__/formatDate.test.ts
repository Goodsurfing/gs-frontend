import { describe, expect, it } from "vitest";

import { formatDayMonthYear } from "../formatDate";

describe("formatDayMonthYear", () => {
    it("ISO-дату приводит к дд.мм.гггг", () => {
        expect(formatDayMonthYear("2027-05-01T10:00:00+03:00")).toBe("01.05.2027");
    });
    it("d.m.Y от API оставляет как есть", () => {
        expect(formatDayMonthYear("26.10.2029")).toBe("26.10.2029");
    });
    it("пусто и мусор — пустая строка", () => {
        expect(formatDayMonthYear(null)).toBe("");
        expect(formatDayMonthYear("не дата")).toBe("");
    });
});
