import { describe, expect, it } from "vitest";

import { safeHref } from "../safeHref";

describe("ссылки из данных в админке", () => {
    it("пропускает http(s), mailto и пути сайта", () => {
        expect(safeHref("https://expedition.goodsurfing.org")).toBe("https://expedition.goodsurfing.org");
        expect(safeHref("mailto:a@b.c")).toBe("mailto:a@b.c");
        expect(safeHref("/offers/1")).toBe("/offers/1");
    });

    it("не пропускает javascript:, data: и адреса без схемы", () => {
        expect(safeHref("javascript:alert(1)")).toBeUndefined();
        expect(safeHref(" JavaScript:alert(1)")).toBeUndefined();
        expect(safeHref("data:text/html,x")).toBeUndefined();
        expect(safeHref("//evil.example")).toBeUndefined();
        expect(safeHref(null)).toBeUndefined();
    });
});
