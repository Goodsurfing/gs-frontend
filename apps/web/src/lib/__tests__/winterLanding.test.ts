import { describe, expect, it } from "vitest";

import { winterSeason } from "../winterLanding";

describe("ближайшая зима", () => {
    it("с марта по декабрь — зима, которая начинается в декабре этого года", () => {
        expect(winterSeason("2026-11-10")).toEqual({ start: "2026-12-01", end: "2027-02-28", label: "2026/27" });
        expect(winterSeason("2026-03-01")).toEqual({ start: "2026-12-01", end: "2027-02-28", label: "2026/27" });
        expect(winterSeason("2026-12-31").start).toBe("2026-12-01");
    });

    it("в январе и феврале — текущая; високосный февраль", () => {
        expect(winterSeason("2027-01-15")).toEqual({ start: "2026-12-01", end: "2027-02-28", label: "2026/27" });
        expect(winterSeason("2028-02-10")).toEqual({ start: "2027-12-01", end: "2028-02-29", label: "2027/28" });
    });
});

describe("тексты зимней страницы", () => {
    it("Гудсёрфинг — НКО: нет цен и «стоит» (решение 10.11.2026)", async () => {
        const { WINTER } = await import("../winterLanding");
        const { VOLUNTEERING_LANDINGS } = await import("../volunteeringLandings");
        expect(JSON.stringify([WINTER, VOLUNTEERING_LANDINGS])).not.toMatch(/₽|\$|стоит|стоимост|цен[аы]\b|дешевле/i);
    });
});
