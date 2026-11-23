import { describe, expect, it } from "vitest";

import { searchLandingHint, specialLandingLinks } from "../specialLandings";

describe("ссылки на страницы под спрос (GS-280)", () => {
    it("подсказка в поиске: зима и workaway, только по-русски", () => {
        expect(searchLandingHint("зимой на байкал", "ru")).toEqual({ title: "Волонтёрство зимой", href: "/winter-volunteering" });
        expect(searchLandingHint("Workaway", "ru")?.href).toBe("/workaway-russia");
        expect(searchLandingHint("воркэвэй", "ru")?.href).toBe("/workaway-russia");
        expect(searchLandingHint("ферма", "ru")).toBeNull();
        expect(searchLandingHint("зима", "en")).toBeNull();
        expect(searchLandingHint("  ", "ru")).toBeNull();
    });

    it("в «Ещё направления» — только на русском", () => {
        expect(specialLandingLinks("ru").map((item) => item.href)).toEqual(["/winter-volunteering", "/workaway-russia"]);
        expect(specialLandingLinks("es")).toEqual([]);
    });
});
