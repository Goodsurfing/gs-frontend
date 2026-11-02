import type { components } from "@goodsurfing/api";

type S = components["schemas"];

/* ── Общее ──────────────────────────────────────────────────────────────── */

/** Включить или выключить значение в списке; max — сколько можно выбрать всего */
export function toggleIn<T>(list: readonly T[], value: T, max = Infinity): T[] {
    if (list.includes(value)) return list.filter((item) => item !== value);
    return list.length < max ? [...list, value] : [...list];
}

/* ── «Что делать» ───────────────────────────────────────────────────────── */

export type TimeType = "week" | "day" | "month";
export const TIME_TYPES: readonly TimeType[] = ["week", "day", "month"];
/** Сколько часов может быть за период (WorkingHoursField) */
export const MAX_HOURS: Record<TimeType, number> = { day: 24, week: 168, month: 744 };
export const DAY_OFF_OPTIONS = [0, 1, 2, 3, 4, 5, 6] as const;
/** Навыков из справочника — не больше 11 (условие старого фронта «≤ 10 перед добавлением»), своих — не больше 10 */
export const MAX_SKILLS = 11;
export const MAX_EXTRA_SKILLS = 10;

export interface WhatToDoForm {
    skills: number[];
    additionalSkills: string[];
    hours: number;
    dayOff: number;
    timeType: TimeType;
    externalInfo: string;
}

export const emptyWhatToDo = (): WhatToDoForm => ({ skills: [], additionalSkills: [], hours: 6, dayOff: 2, timeType: "week", externalInfo: "" });

const isTimeType = (value: unknown): value is TimeType => typeof value === "string" && (TIME_TYPES as readonly string[]).includes(value);

/** Форма из GET /api/v1/vacancy/{id} (whatToDo); нет блока — значения по умолчанию */
export function whatToDoFromApi(todo: S["WhatToDoResult"] | null | undefined): WhatToDoForm {
    if (!todo) return emptyWhatToDo();
    return {
        skills: (todo.skills ?? []).map((skill) => skill.id),
        additionalSkills: [...(todo.additionalSkills ?? [])],
        hours: typeof todo.hour === "number" ? todo.hour : 6,
        dayOff: typeof todo.dayOff === "number" ? todo.dayOff : 2,
        timeType: isTimeType(todo.timeType) ? todo.timeType : "week",
        externalInfo: todo.externalInfo ?? "",
    };
}

/** Тело PATCH /api/v1/vacancy/what-to-do/{id} */
export const whatToDoToApi = (form: WhatToDoForm): S["EditWhatToDoCommand"] => ({
    skillIds: form.skills,
    additionalSkills: form.additionalSkills,
    hours: form.hours,
    dayOff: form.dayOff,
    timeType: form.timeType,
    externalInfo: form.externalInfo,
});

/** Часы: целое от 0 до предела периода, иначе значение не меняется */
export function setHours(form: WhatToDoForm, input: string): WhatToDoForm {
    // Пустое поле (стёрли, чтобы набрать заново, или браузер не разобрал ввод) — значение не меняется
    if (!/^\d+$/.test(input)) return form;
    const hours = Number(input);
    return hours <= MAX_HOURS[form.timeType] ? { ...form, hours } : form;
}

/** Смена периода урезает часы до его предела («в день» — не больше 24) */
export const setTimeType = (form: WhatToDoForm, timeType: TimeType): WhatToDoForm => ({ ...form, timeType, hours: Math.min(form.hours, MAX_HOURS[timeType]) });

/** Свой навык: без пустых и повторов, не больше десяти */
export function addExtraSkill(list: readonly string[], text: string): string[] {
    const skill = text.trim();
    if (!skill || list.includes(skill) || list.length >= MAX_EXTRA_SKILLS) return [...list];
    return [...list, skill];
}

/** Правка своего навыка: пустое или повтор другого — не принимается */
export function renameExtraSkill(list: readonly string[], index: number, text: string): string[] {
    const skill = text.trim();
    if (!skill || list.some((item, i) => i !== index && item === skill)) return [...list];
    return list.map((item, i) => (i === index ? skill : item));
}

/* ── «Условия» ──────────────────────────────────────────────────────────── */

export const CURRENCIES = [{ name: "RUB", symbol: "₽" }, { name: "USD", symbol: "$" }, { name: "EUR", symbol: "€" }] as const;

export interface ConditionsForm {
    /** Переключатели «Нет / Да» у жилья, питания и проезда */
    housing: boolean;
    food: boolean;
    travel: boolean;
    houseIds: number[];
    foodIds: number[];
    transferIds: number[];
    conveniences: string[];
    additionalFeatures: string[];
    contribution: number;
    reward: number;
    currency: string;
    additionalConditions: string;
}

/** Новая вакансия: переключатели включены (defaultFormFields старого фронта) */
export const emptyConditions = (): ConditionsForm => ({
    housing: true, food: true, travel: true, houseIds: [], foodIds: [], transferIds: [], conveniences: [], additionalFeatures: [],
    contribution: 0, reward: 0, currency: "RUB", additionalConditions: "",
});

/** Форма из GET /api/v1/vacancy/{id} (condition): переключатель включён, если что-то выбрано */
export function conditionsFromApi(condition: S["ConditionResult"] | null | undefined): ConditionsForm {
    if (!condition) return emptyConditions();
    const ids = (items: S["DefaultResult"][] | undefined) => (items ?? []).map((item) => item.id);
    const houseIds = ids(condition.houses);
    const foodIds = ids(condition.foods);
    const transferIds = ids(condition.transfers);
    return {
        housing: houseIds.length > 0, food: foodIds.length > 0, travel: transferIds.length > 0,
        houseIds, foodIds, transferIds,
        conveniences: [...(condition.conveniences ?? [])],
        additionalFeatures: [...(condition.additionalFeatures ?? [])],
        contribution: condition.volunteerContributions ?? 0,
        reward: condition.volunteerRemuneration ?? 0,
        currency: condition.currency || "RUB",
        additionalConditions: condition.additionalConditions ?? "",
    };
}

/** Тело PATCH /api/v1/vacancy/condition/{id}; выключенный раздел уходит пустым */
export const conditionsToApi = (form: ConditionsForm): S["EditConditionCommand"] => ({
    houseIds: form.housing ? form.houseIds : [],
    foodIds: form.food ? form.foodIds : [],
    transferIds: form.travel ? form.transferIds : [],
    conveniences: form.conveniences,
    additionalFeatures: form.additionalFeatures,
    volunteerContributions: form.contribution,
    volunteerRemuneration: form.reward,
    currency: form.currency,
    additionalConditions: form.additionalConditions,
});

/** Включён «Да», но ничего не выбрано — ошибка «Не выбрано» под разделом */
export function conditionsErrors(form: ConditionsForm): { housing: boolean; food: boolean; travel: boolean } {
    return {
        housing: form.housing && form.houseIds.length === 0,
        food: form.food && form.foodIds.length === 0,
        travel: form.travel && form.transferIds.length === 0,
    };
}

/** Сумма: только цифры, не длиннее 15 знаков; иначе (в том числе пусто) null — значение не меняется */
export function parseMoney(input: string): number | null {
    return input.length <= 15 && /^\d+$/.test(input) ? Number(input) : null;
}

/* ── «Последние штрихи» ─────────────────────────────────────────────────── */

export interface FinishForm {
    additionalConditions: string[];
    onlyVerified: boolean;
    helloText: string;
    roles: string;
    questionnaireUrl: string;
    questions: string[];
}

export const emptyFinish = (): FinishForm => ({ additionalConditions: [], onlyVerified: false, helloText: "", roles: "", questionnaireUrl: "", questions: [] });

export function finishFromApi(finish: S["FinishingToucheResult"] | null | undefined): FinishForm {
    if (!finish) return emptyFinish();
    return {
        additionalConditions: [...(finish.additionalConditions ?? [])],
        onlyVerified: !!finish.onlyVerified,
        helloText: finish.helloText ?? "",
        roles: finish.roles ?? "",
        questionnaireUrl: finish.questionnaireUrl ?? "",
        questions: [...(finish.questions ?? [])],
    };
}

/** Тело finishingTouches для PATCH /api/v1/vacancies/{id} */
export const finishToApi = (form: FinishForm): S["VacancyFinishingTouches-vacancy.write"] => ({
    additionalConditions: form.additionalConditions,
    onlyVerified: form.onlyVerified,
    helloText: form.helloText,
    roles: form.roles,
    questionnaireUrl: form.questionnaireUrl,
    questions: form.questions,
});

/** Ссылка на анкету: пусто или похоже на адрес сайта (правило старой формы) */
export const isQuestionnaireUrl = (value: string) => value === "" || /^(https?:\/\/)?([\w\d.-]+\.)+[\w\d]{2,}(\/.+)?$/.test(value);

/** Новый вопрос: не больше десяти и не пока последний пустой */
export function addQuestion(questions: readonly string[]): string[] {
    if (questions.length >= 10 || questions[questions.length - 1] === "") return [...questions];
    return [...questions, ""];
}

/* ── Публикация ─────────────────────────────────────────────────────────── */

/** Ответ бэкенда при публикации сверх бесплатного лимита (VacancyConstant::FREE_VACANCY_LIMIT, GS-172) */
export const VACANCY_LIMIT_DETAIL = "Free account allows up to 1 published vacancy. Get a membership to publish without limits.";

/** Тексты ошибок бэкенда, у которых есть перевод (getErrorText старого фронта) — ключи словаря translation */
const ERROR_KEYS: Record<string, string> = {
    [VACANCY_LIMIT_DETAIL]: "errors.freeAccountPublishedVacancyLimit",
    "Fill in the vacancy title, description and address before publishing.": "errors.vacancyIncomplete",
};

const record = (value: unknown): Record<string, unknown> | null => (value && typeof value === "object" ? value as Record<string, unknown> : null);

/** Текст ошибки из ответа API: detail, title, errors[], error, message */
export function errorMessage(error: unknown): string | null {
    const data = record(error);
    if (!data) return null;
    const text = (key: string) => (typeof data[key] === "string" && data[key] ? data[key] as string : null);
    // Порядок как у getErrorText старого фронта: detail, title, список errors, error, message
    if (text("detail") || text("title")) return text("detail") ?? text("title");
    if (Array.isArray(data.errors) && data.errors.length) return data.errors.join(". ");
    return text("error") ?? text("message");
}

/** Публикация упёрлась в лимит бесплатных вакансий — показать окно с призывом оформить членство */
export const isVacancyLimitError = (error: unknown) => errorMessage(error) === VACANCY_LIMIT_DETAIL;

/** Ключ перевода для известной ошибки бэкенда или null — тогда показывать текст как есть */
export const errorKey = (message: string): string | null => ERROR_KEYS[message] ?? null;
