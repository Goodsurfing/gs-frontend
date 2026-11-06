import { describe, expect, it } from "vitest";

import { formatLongDate } from "../formatDate";

// ICU ставит неразрывные пробелы — сравниваем с обычными
const plain = (text: string) => text.replace(/\s/g, " ");

describe("дата словами", () => {
    it("строка toDateString старого SPA — на языке страницы", () => {
        expect(plain(formatLongDate("Fri Nov 06 2026", "ru"))).toBe("6 ноября 2026");
        expect(plain(formatLongDate("Fri Nov 06 2026", "en"))).toBe("November 6, 2026");
        expect(plain(formatLongDate("Fri Nov 06 2026", "es"))).toBe("6 de noviembre de 2026");
    });
    it("пусто и непонятное — без падения", () => {
        expect(formatLongDate("", "ru")).toBe("");
        expect(formatLongDate("не дата", "ru")).toBe("не дата");
    });
});
