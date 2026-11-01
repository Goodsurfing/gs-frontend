import { describe, expect, it } from "vitest";

import {
    addLanguage, commitAgeMax, commitAgeMin, coverFileError, coverSizeError, dayFromApi, descriptionErrors, toggleCategory, dayLabel, durationLabel, emptyWhenForm, emptyWhoNeedsForm, languageChoices, setAgeMin, toggleNoAgeLimit, whoNeedsErrors, whoNeedsFromApi, whoNeedsToApi, offerWizardMenu, parseGeocode, parseOfferId, placeLabel,
    setDurationFrom, setDurationTo, setPeriodEnd, setPeriodStart, toggleLastMoment, toggleNoEndDate,
    whenFormFromApi, whenFormToApi,
} from "../offerWizard";

describe("меню мастера", () => {
    it("назад к вакансиям и семь шагов с номером вакансии; en — с префиксом", () => {
        const menu = offerWizardMenu("en", (key) => key, "42");
        expect(menu.map((item) => item.href)).toEqual([
            "/en/host/my-offers",
            "/en/offers/where/42", "/en/offers/when/42", "/en/offers/who-needs/42", "/en/offers/description/42",
            "/en/offers/what-to-do/42", "/en/offers/conditions/42", "/en/offers/finishing-touches/42",
        ]);
        expect(offerWizardMenu("ru", (key) => key, "7")[1]?.href).toBe("/offers/where/7");
    });
    it("номер вакансии — только цифры", () => {
        expect(parseOfferId("7279")).toBe("7279");
        expect(parseOfferId("abc")).toBeNull();
        expect(parseOfferId("1;2")).toBeNull();
    });
});

describe("даты", () => {
    it("ISO берётся календарной частью, без сдвига часового пояса", () => {
        expect(dayFromApi("2026-11-05T23:34:33-05:00")).toBe("2026-11-05");
    });
    it("d.m.Y и d-m-Y тоже понимаются; мусор и несуществующие даты — null", () => {
        expect(dayFromApi("29.10.2027")).toBe("2027-10-29");
        expect(dayFromApi("1-2-2027")).toBe("2027-02-01");
        expect(dayFromApi("31.02.2027")).toBeNull();
        expect(dayFromApi("завтра")).toBeNull();
        expect(dayFromApi(null)).toBeNull();
    });
    it("подпись в поле — ДД-ММ-ГГГГ", () => {
        expect(dayLabel("2027-10-29")).toBe("29-10-2027");
        expect(dayLabel(null)).toBe("");
    });
});

describe("периоды", () => {
    it("начало позже конца или без конца — конец переезжает", () => {
        expect(setPeriodStart({ start: null, end: null }, "2026-12-01")).toEqual({ start: "2026-12-01", end: "2026-12-01" });
        expect(setPeriodStart({ start: "2026-12-01", end: "2026-12-05" }, "2026-12-10")).toEqual({ start: "2026-12-10", end: "2026-12-10" });
        expect(setPeriodStart({ start: "2026-12-01", end: "2026-12-05" }, "2026-12-03")).toEqual({ start: "2026-12-03", end: "2026-12-05" });
    });
    it("конец раньше начала не принимается; без начала — начало сегодня", () => {
        const period = { start: "2026-12-05", end: "2026-12-06" };
        expect(setPeriodEnd(period, "2026-12-01")).toBe(period);
        expect(setPeriodEnd({ start: null, end: null }, "2026-12-01", "2026-11-01")).toEqual({ start: "2026-11-01", end: "2026-12-01" });
    });
});

describe("срок участия", () => {
    it("«от» — от 1 и меньше «до», «до» — от 2 и больше «от»", () => {
        expect(setDurationFrom([7, 30], 0)).toEqual([7, 30]);
        expect(setDurationFrom([7, 30], 30)).toEqual([7, 30]);
        expect(setDurationFrom([7, 30], 10)).toEqual([10, 30]);
        expect(setDurationTo([7, 30], 7)).toEqual([7, 30]);
        expect(setDurationTo([7, 30], 1)).toEqual([7, 30]);
        expect(setDurationTo([7, 30], 60)).toEqual([7, 60]);
        expect(setDurationTo([7, 30], Number.NaN)).toEqual([7, 30]);
    });
});

describe("форма «Когда»", () => {
    const api = {
        isFullYearAcceptable: false, durationMinDays: 7, durationMaxDays: 30, isApplicableAtTheEnd: true,
        applicationEndDate: "2027-10-29T00:00:00+00:00",
        periods: [{ start: "2026-11-05T13:34:33+00:00", ending: "2026-12-29T13:34:33+00:00" }],
    };
    it("из API и обратно", () => {
        const form = whenFormFromApi(api);
        expect(form.periods).toEqual([{ start: "2026-11-05", end: "2026-12-29" }]);
        expect(form.applicationEndDate).toBe("2027-10-29");
        expect(form.isWithoutApplicationDate).toBe(false);
        expect(whenFormToApi(form)).toEqual({
            periods: [{ start: "2026-11-05", ending: "2026-12-29" }],
            durationMinDays: 7, durationMaxDays: 30, applicationEndDate: "2027-10-29",
            isFullYearAcceptable: false, isApplicableAtTheEnd: true,
        });
    });
    it("нет блока — значения по умолчанию: 7–186 дней, окончание приёма сегодня", () => {
        expect(whenFormFromApi(null, "2026-11-01")).toEqual(emptyWhenForm("2026-11-01"));
        expect(emptyWhenForm("2026-11-01")).toMatchObject({ duration: [7, 186], applicationEndDate: "2026-11-01", isWithoutApplicationDate: false });
    });
    it("круглый год — без периодов; заполненный, но не добавленный период сохраняется, неполный — нет", () => {
        const form = { ...emptyWhenForm("2026-11-01"), periods: [{ start: "2026-12-01", end: "2026-12-10" }] };
        expect(whenFormToApi({ ...form, isFullYearAcceptable: true }).periods).toEqual([]);
        expect(whenFormToApi(form, { start: "2027-01-01", end: "2027-01-05" }).periods).toHaveLength(2);
        expect(whenFormToApi(form, { start: "2027-01-01", end: null }).periods).toHaveLength(1);
    });
    it("без даты окончания уходит null", () => {
        expect(whenFormToApi({ ...emptyWhenForm(), isWithoutApplicationDate: true }).applicationEndDate).toBeNull();
    });
    it("«последний момент» снимает дату окончания и запрещает её задать", () => {
        const on = toggleLastMoment(emptyWhenForm("2026-11-01"));
        expect(on).toMatchObject({ isApplicableAtTheEnd: true, isWithoutApplicationDate: true, applicationEndDate: null });
        expect(toggleNoEndDate(on)).toBe(on);
        const off = toggleLastMoment(on);
        expect(off.isApplicableAtTheEnd).toBe(false);
        expect(toggleNoEndDate(off, "2026-11-02")).toMatchObject({ isWithoutApplicationDate: false, applicationEndDate: "2026-11-02" });
    });
});

describe("геокодер", () => {
    it("точки из ответа Яндекса; битые — пропускаются", () => {
        const json = {
            response: {
                GeoObjectCollection: {
                    featureMember: [
                        { GeoObject: { name: "улица Баумана", description: "Казань, Россия", Point: { pos: "49.111534 55.792422" } } },
                        { GeoObject: { name: "без координат" } },
                        { GeoObject: { name: "кривые", Point: { pos: "x y" } } },
                    ],
                },
            },
        };
        const places = parseGeocode(json);
        expect(places).toEqual([{ name: "улица Баумана", description: "Казань, Россия", longitude: 49.111534, latitude: 55.792422 }]);
        expect(placeLabel(places[0]!)).toBe("Казань, Россия, улица Баумана");
        expect(parseGeocode(null)).toEqual([]);
        expect(parseGeocode({ response: {} })).toEqual([]);
    });
});

describe("подпись срока", () => {
    const w = { day: "день", days2: "дня", days5: "дней", month: "месяц", months2: "месяца", months5: "месяцев" };
    it("как в старом фронте: месяц — 31 день", () => {
        expect(durationLabel(7, w)).toBe("7 дней");
        expect(durationLabel(30, w)).toBe("30 дней");
        expect(durationLabel(1, w)).toBe("1 день");
        expect(durationLabel(3, w)).toBe("3 дня");
        expect(durationLabel(31, w)).toBe("1 месяц");
        expect(durationLabel(40, w)).toBe("1 месяц, 9 дней");
        expect(durationLabel(62, w)).toBe("2 месяца");
        expect(durationLabel(52, w)).toBe("1 месяц, 21 день");
        expect(durationLabel(186, w)).toBe("6 месяцев");
    });
});

describe("форма «Кто нужен»", () => {
    it("из API и обратно; пустой блок — значения старого фронта", () => {
        const api = { gender: ["male" as const], ageMin: 18, ageMax: 30, requiredLanguages: [{ language: "English", languageLevel: "advanced" }], needAllLanguages: true, volunteerPlaceCount: 4, receptionPlace: "compatriot" as const, additionalInfo: "x" };
        expect(whoNeedsToApi(whoNeedsFromApi(api))).toEqual({ ...api });
        expect(whoNeedsFromApi(null)).toEqual({ gender: [], ageMin: 12, ageMax: 18, languages: [], needAllLanguages: false, volunteerPlaces: 0, receptionPlace: "any", additionalInfo: "" });
    });
    it("обязательны пол и число мест", () => {
        expect(whoNeedsErrors(emptyWhoNeedsForm())).toEqual({ gender: true, volunteerPlaces: true });
        expect(whoNeedsErrors({ ...emptyWhoNeedsForm(), gender: ["other"], volunteerPlaces: 1 })).toEqual({ gender: false, volunteerPlaces: false });
    });
    it("возраст: «от» тянет «до», границы 12 и 100, «без ограничения»", () => {
        expect(setAgeMin({ ageMin: 12, ageMax: 18 }, 20)).toEqual({ ageMin: 20, ageMax: 20 });
        expect(setAgeMin({ ageMin: 12, ageMax: 18 }, 15)).toEqual({ ageMin: 15, ageMax: 18 });
        expect(commitAgeMin({ ageMin: 5, ageMax: 18 })).toEqual({ ageMin: 12, ageMax: 18 });
        expect(commitAgeMin({ ageMin: 150, ageMax: 18 })).toEqual({ ageMin: 12, ageMax: 18 });
        expect(commitAgeMax({ ageMin: 20, ageMax: 15 })).toEqual({ ageMin: 20, ageMax: 20 });
        expect(commitAgeMax({ ageMin: 20, ageMax: 150 })).toEqual({ ageMin: 20, ageMax: 100 });
        expect(toggleNoAgeLimit({ ageMin: 20, ageMax: 30 })).toEqual({ ageMin: 20, ageMax: 100 });
        expect(toggleNoAgeLimit({ ageMin: 20, ageMax: 100 })).toEqual({ ageMin: 20, ageMax: 20 });
    });
    it("языки: без повторов, «Не важен» только в строке добавления, не больше десяти", () => {
        const selected = [{ language: "English", languageLevel: "not_matter" as const }];
        expect(languageChoices(selected, "not_matter", true)).not.toContain("English");
        expect(languageChoices(selected, "not_matter", true)).toContain("not_matter");
        expect(languageChoices(selected, "English", false)).toContain("English");
        expect(languageChoices(selected, "English", false)).not.toContain("not_matter");
        expect(addLanguage(selected, { language: "not_matter", languageLevel: "not_matter" })).toBeNull();
        expect(addLanguage(selected, { language: "English", languageLevel: "advanced" })).toBeNull();
        expect(addLanguage(selected, { language: "Deutsch", languageLevel: "beginner" })).toHaveLength(2);
        const ten = Array.from({ length: 10 }, (_, i) => ({ language: `L${i}`, languageLevel: "not_matter" as const }));
        expect(addLanguage(ten, { language: "Deutsch", languageLevel: "beginner" })).toBeNull();
    });
});

describe("форма «Описание»", () => {
    const full = { title: "Т", categoryIds: [1], shortDescription: "к", fullDescription: "п" };
    it("всё обязательно, пробелы — не текст", () => {
        expect(descriptionErrors(full, true)).toEqual({});
        expect(descriptionErrors({ title: " ", categoryIds: [], shortDescription: "", fullDescription: "" }, false))
            .toEqual({ title: true, categoryIds: true, shortDescription: true, fullDescription: true, cover: true });
    });
    it("категорий не больше пяти, повторный щелчок снимает", () => {
        expect(toggleCategory([1, 2], 2)).toEqual([1]);
        expect(toggleCategory([1, 2, 3, 4, 5], 6)).toEqual([1, 2, 3, 4, 5]);
        expect(toggleCategory([1], 6)).toEqual([1, 6]);
    });
    it("обложка: формат, 5 МБ, не меньше 1280×720", () => {
        expect(coverFileError("a.JPG", 1000)).toBeNull();
        expect(coverFileError("a.gif", 1000)).toBe("description.Неверный формат файла");
        expect(coverFileError("a.png", 6 * 1024 * 1024)).toBe("description.Размер файла превышает 5МБ");
        expect(coverSizeError(1280, 720)).toBeNull();
        expect(coverSizeError(1279, 900)).not.toBeNull();
    });
});
