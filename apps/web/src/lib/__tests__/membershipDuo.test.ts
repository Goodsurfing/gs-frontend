import { describe, expect, it } from "vitest";

import { atomDate, DUO_KEYS, duoLabels, fill, personName } from "@/components/membership/duo";
import { nextRoute } from "@/lib/authSession";

import ru from "../../../../../public/locales/ru/membership.json";
import en from "../../../../../public/locales/en/membership.json";
import es from "../../../../../public/locales/es/membership.json";

describe("членство «на двоих»", () => {
    it("подставляет значения в шаблоны словаря", () => {
        expect(fill("{{name}} с вами до {{date}}", { name: "Анна", date: "04.11.2027" })).toBe("Анна с вами до 04.11.2027");
        expect(fill("{{ count }} писем", { count: 3 })).toBe("3 писем");
    });

    it("дата из ATOM и имя человека", () => {
        expect(atomDate("2027-11-04T12:00:00+00:00")).toBe("04.11.2027");
        expect(atomDate(null)).toBe("");
        expect(personName({ firstName: "Анна", lastName: null })).toBe("Анна");
    });

    it("после входа возвращает на страницу приглашения", () => {
        expect(nextRoute("", "duo", "abc123")).toBe("/membership/duo/abc123");
        expect(nextRoute("/en", "duo", "abc123")).toBe("/en/membership/duo/abc123");
    });

    it("все тексты есть на трёх языках", () => {
        for (const dictionary of [ru, en, es]) {
            const duo = (dictionary as { duo?: Record<string, string> }).duo ?? {};
            for (const key of DUO_KEYS) expect(duo[key], key).toBeTruthy();
        }
        const labels = duoLabels((key) => key);
        expect(labels["offer-button"]).toBe("duo.offer-button");
    });
});
