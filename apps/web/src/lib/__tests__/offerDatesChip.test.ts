import { describe, expect, it } from "vitest";

import { offerDatesChip, shortAddress } from "../offerHighlights";

const t = (key: string) => ({ "highlights.datesPassed": "Даты прошли", "highlights.fullYear": "Круглый год" })[key] ?? key;
const TODAY = "10.11.2026";

describe("пометка «когда» в обложке вакансии", () => {
    it("ближайший незакончившийся период, остальные — «+N»", () => {
        const when = { periods: [
            { start: "01.06.2027", end: "30.06.2027" },
            { start: "01.11.2026", end: "20.11.2026" },
            { start: "01.03.2026", end: "31.03.2026" },
        ] };
        expect(offerDatesChip(when, false, t, TODAY)).toEqual({ text: "01.11–20.11.2026 +1", passed: false });
    });

    it("период через Новый год — с обоими годами", () => {
        expect(offerDatesChip({ periods: [{ start: "20.12.2026", end: "10.01.2027" }] }, false, t, TODAY)?.text).toBe("20.12.2026–10.01.2027");
    });

    it("заканчивается сегодня — ещё не прошли", () => {
        expect(offerDatesChip({ periods: [{ start: "01.11.2026", end: TODAY }] }, false, t, TODAY)?.passed).toBe(false);
    });

    it("все периоды прошли — предупреждение", () => {
        expect(offerDatesChip({ periods: [{ start: "20.07.2026", end: "24.07.2026" }] }, true, t, TODAY)).toEqual({ text: "Даты прошли", passed: true });
    });

    it("без периодов: круглый год — пометка, иначе ничего", () => {
        expect(offerDatesChip({ periods: [], isFullYearAcceptable: true }, false, t, TODAY)).toEqual({ text: "Круглый год", passed: false });
        expect(offerDatesChip({ periods: [], isFullYearAcceptable: false }, false, t, TODAY)).toBeNull();
        expect(offerDatesChip(null, undefined, t, TODAY)).toBeNull();
    });
});

describe("короткий адрес", () => {
    it("без страны и муниципальных делений, не больше двух частей", () => {
        expect(shortAddress("Пинежский муниципальный округ, Архангельская область, Россия, Пинежский государственный природный заповедник федерального значения"))
            .toBe("Архангельская область, Пинежский государственный природный заповедник федерального значения");
        expect(shortAddress("Каменногорское городское поселение, Выборгский район, Ленинградская область, Россия")).toBe("Ленинградская область");
        expect(shortAddress("Россия, Республика Бурятия, Улюн")).toBe("Республика Бурятия, Улюн");
        expect(shortAddress("Лахденпохский муниципальный округ, Республика Карелия, квартал 0010142, Россия")).toBe("Республика Карелия");
        expect(shortAddress("Республика Алтай, 04:05:0101001")).toBe("Республика Алтай");
    });

    it("короткий и пустой — как есть", () => {
        expect(shortAddress("Москва")).toBe("Москва");
        expect(shortAddress("Россия")).toBe("Россия");
        expect(shortAddress(null)).toBe("");
    });
});
