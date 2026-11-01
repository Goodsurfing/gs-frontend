import { describe, expect, it } from "vitest";

import {
    addExtraSkill, addQuestion, conditionsErrors, conditionsFromApi, conditionsToApi, emptyConditions, errorKey, errorMessage,
    finishFromApi, finishToApi, isQuestionnaireUrl, isVacancyLimitError, parseMoney, renameExtraSkill, setHours, setTimeType,
    toggleIn, VACANCY_LIMIT_DETAIL, whatToDoFromApi, whatToDoToApi,
} from "../offerWizardFinish";

const item = (id: number) => ({ id, name: `n${id}`, image: { id: "", contentUrl: "" } }) as never;

describe("общее", () => {
    it("toggleIn: добавляет, убирает, не больше max", () => {
        expect(toggleIn([1, 2], 3)).toEqual([1, 2, 3]);
        expect(toggleIn([1, 2], 2)).toEqual([1]);
        expect(toggleIn([1, 2], 3, 2)).toEqual([1, 2]);
    });
});

describe("«Что делать»", () => {
    it("из API и обратно; нет блока — 6 часов в неделю, 2 выходных", () => {
        const form = whatToDoFromApi({ hour: 8, dayOff: 1, timeType: "day", skills: [item(9), item(14)], additionalSkills: ["Пайка"], externalInfo: "Текст" });
        expect(whatToDoToApi(form)).toEqual({ skillIds: [9, 14], additionalSkills: ["Пайка"], hours: 8, dayOff: 1, timeType: "day", externalInfo: "Текст" });
        expect(whatToDoFromApi(null)).toMatchObject({ hours: 6, dayOff: 2, timeType: "week", skills: [] });
    });
    it("часы — до предела периода; смена периода урезает часы", () => {
        const form = whatToDoFromApi(null);
        expect(setHours(form, "40").hours).toBe(40);
        expect(setHours(form, "169").hours).toBe(6);
        expect(setHours(form, "-1").hours).toBe(6);
        expect(setHours(form, "").hours).toBe(0);
        expect(setTimeType({ ...form, hours: 40 }, "day")).toMatchObject({ timeType: "day", hours: 24 });
    });
    it("свои навыки: без пустых, повторов, не больше 10", () => {
        expect(addExtraSkill(["a"], "  b ")).toEqual(["a", "b"]);
        expect(addExtraSkill(["a"], "a")).toEqual(["a"]);
        expect(addExtraSkill(["a"], " ")).toEqual(["a"]);
        expect(addExtraSkill(Array.from({ length: 10 }, (_, i) => `s${i}`), "x")).toHaveLength(10);
        expect(renameExtraSkill(["a", "b"], 0, "c")).toEqual(["c", "b"]);
        expect(renameExtraSkill(["a", "b"], 0, "b")).toEqual(["a", "b"]);
    });
});

describe("«Условия»", () => {
    it("переключатель включён, если что-то выбрано; выключенный раздел уходит пустым", () => {
        const form = conditionsFromApi({
            houses: [item(1)], foods: [], transfers: [item(4)], conveniences: ["wi-fi"], additionalFeatures: ["horses"],
            volunteerContributions: 100, volunteerRemuneration: 0, currency: "EUR", additionalConditions: "x",
        });
        expect(form).toMatchObject({ housing: true, food: false, travel: true, currency: "EUR" });
        expect(conditionsToApi({ ...form, travel: false })).toEqual({
            houseIds: [1], foodIds: [], transferIds: [], conveniences: ["wi-fi"], additionalFeatures: ["horses"],
            volunteerContributions: 100, volunteerRemuneration: 0, currency: "EUR", additionalConditions: "x",
        });
    });
    it("новая вакансия: «Да» без выбора — ошибка «Не выбрано»", () => {
        expect(conditionsErrors(emptyConditions())).toEqual({ housing: true, food: true, travel: true });
        expect(conditionsErrors({ ...emptyConditions(), houseIds: [1], food: false })).toEqual({ housing: false, food: false, travel: true });
    });
    it("суммы: только цифры, до 15 знаков, пусто — 0", () => {
        expect(parseMoney("120")).toBe(120);
        expect(parseMoney("")).toBe(0);
        expect(parseMoney("1e3")).toBeNull();
        expect(parseMoney("1234567890123456")).toBeNull();
    });
});

describe("«Последние штрихи»", () => {
    it("из API и обратно", () => {
        const api = { additionalConditions: ["allow-kids"], onlyVerified: true, helloText: "Привет", roles: "Правила", questionnaireUrl: "forms.gle/x", questions: ["Q"] };
        expect(finishToApi(finishFromApi(api))).toEqual(api);
        expect(finishFromApi(null)).toMatchObject({ onlyVerified: false, questions: [] });
    });
    it("ссылка на анкету и вопросы", () => {
        expect(isQuestionnaireUrl("")).toBe(true);
        expect(isQuestionnaireUrl("https://forms.gle/abc")).toBe(true);
        expect(isQuestionnaireUrl("не ссылка")).toBe(false);
        expect(addQuestion([])).toEqual([""]);
        expect(addQuestion(["a", ""])).toEqual(["a", ""]);
        expect(addQuestion(Array.from({ length: 10 }, () => "q"))).toHaveLength(10);
    });
});

describe("ошибки публикации", () => {
    it("лимит бесплатных вакансий распознаётся по detail", () => {
        expect(isVacancyLimitError({ detail: VACANCY_LIMIT_DETAIL, status: 400 })).toBe(true);
        expect(isVacancyLimitError({ detail: "Другое" })).toBe(false);
        expect(isVacancyLimitError(null)).toBe(false);
        expect(errorKey(VACANCY_LIMIT_DETAIL)).toBe("errors.freeAccountPublishedVacancyLimit");
    });
    it("текст ошибки: detail, title, errors[], error, message", () => {
        expect(errorMessage({ title: "T" })).toBe("T");
        expect(errorMessage({ errors: ["a", "b"] })).toBe("a. b");
        expect(errorMessage({ error: "E" })).toBe("E");
        expect(errorMessage("x")).toBeNull();
        expect(errorKey("Fill in the vacancy title, description and address before publishing.")).toBe("errors.vacancyIncomplete");
        expect(errorKey("что-то")).toBeNull();
    });
});
