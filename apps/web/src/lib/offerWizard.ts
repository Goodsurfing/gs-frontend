import type { paths } from "@goodsurfing/api";

import type { CabinetMenuItem } from "@/components/cabinet/CabinetFrame";
import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";

import { routes } from "./routes";

/** Шаги мастера вакансии в порядке прохождения (адреса — как у старого фронта: /offers/{шаг}/{id}) */
export const OFFER_STEPS = ["welcome", "where", "when", "who-needs", "description", "what-to-do", "conditions", "finishing-touches"] as const;
export type OfferStep = (typeof OFFER_STEPS)[number];

/** Меню мастера (shared/data/sidebar/offer-pages старого фронта): назад к вакансиям и семь шагов, без «Привет» */
export function offerWizardMenu(locale: Locale, t: Translate, id: string): CabinetMenuItem[] {
    const step = (name: OfferStep, key: string, icon: string): CabinetMenuItem => ({
        text: t(`main.sidebar.${key}`),
        href: routes.offerStep(locale, name, id),
        icon: `offers/${icon}`,
    });
    return [
        { text: t("main.sidebar.К предложениям"), href: routes.myOffers(locale), icon: "offers/back" },
        step("where", "Где", "pin"),
        step("when", "Когда", "calendar"),
        step("who-needs", "Кто нужен", "right-user"),
        step("description", "Описание", "checklist"),
        step("what-to-do", "Что делать", "view-list"),
        step("conditions", "Условия", "list-checkbox"),
        step("finishing-touches", "Последние штрихи", "writing-fluently"),
    ];
}

/** Номер вакансии из адреса: только цифры, иначе — страница «не найдено» */
export const parseOfferId = (value: string): string | null => (/^\d{1,10}$/.test(value) ? value : null);

/* ── Даты ───────────────────────────────────────────────────────────────── */

/** Календарный день «ГГГГ-ММ-ДД» — так даты хранятся в форме и уходят в API (как formattingDate старого фронта) */
export type Day = string;

const pad = (n: number) => String(n).padStart(2, "0");

export const dayFromParts = (year: number, month: number, date: number): Day => `${year}-${pad(month)}-${pad(date)}`;

/** Сегодня по часам браузера */
export const today = (now = new Date()): Day => dayFromParts(now.getFullYear(), now.getMonth() + 1, now.getDate());

/**
 * День из строки API. /api/v1/vacancies отдаёт ISO («2026-11-05T13:34:33+00:00»),
 * /api/v1/vacancy — d.m.Y или d-m-Y: берём календарную часть без перевода в
 * часовой пояс браузера (иначе дата съезжает на сутки к западу от Гринвича).
 */
export function dayFromApi(value: string | null | undefined): Day | null {
    if (!value) return null;
    const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    const dmy = /^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/.exec(value.trim());
    const [year, month, date] = iso ? [iso[1], iso[2], iso[3]].map(Number) : dmy ? [dmy[3], dmy[2], dmy[1]].map(Number) : [];
    if (year === undefined || month === undefined || date === undefined) return null;
    const check = new Date(year, month - 1, date);
    if (check.getFullYear() !== year || check.getMonth() !== month - 1 || check.getDate() !== date) return null;
    return dayFromParts(year, month, date);
}

/** Подпись в поле даты: «ДД-ММ-ГГГГ», как DatePickerCalendar старого фронта */
export const dayLabel = (day: Day | null | undefined): string => {
    if (!day) return "";
    const [year, month, date] = day.split("-");
    return `${date}-${month}-${year}`;
};

/** Год, месяц (1–12), число */
export const dayParts = (day: Day): [number, number, number] => {
    const [year = 0, month = 1, date = 1] = day.split("-").map(Number);
    return [year, month, date];
};

/* ── Шаг «Когда» ────────────────────────────────────────────────────────── */

export interface Period { start: Day | null; end: Day | null }

/** Начало периода (DateInputs старого фронта): позже конца или без конца — конец переезжает туда же */
export function setPeriodStart(period: Period, start: Day): Period {
    if (!period.end || start > period.end) return { start, end: start };
    return { start, end: period.end };
}

/** Конец периода: без начала — начало сегодня; раньше начала — не принимается */
export function setPeriodEnd(period: Period, end: Day, now: Day = today()): Period {
    if (!period.start) return { start: now, end };
    if (end < period.start) return period;
    return { start: period.start, end };
}

/** Не больше пяти периодов (OfferWhenPeriods старого фронта) */
export const MAX_PERIODS = 5;

/** Срок участия: ползунок от 1 до 190 дней, по умолчанию 7–186 (OfferWhenSlider старого фронта) */
export const DURATION_MIN = 1;
export const DURATION_MAX = 190;
export const DEFAULT_DURATION: [number, number] = [7, 186];

/** Ручной ввод «от»: не меньше 1 и строго меньше «до», иначе значение не меняется */
export function setDurationFrom([from, to]: [number, number], value: number): [number, number] {
    return Number.isInteger(value) && value >= 1 && value < to ? [value, to] : [from, to];
}

/** Ручной ввод «до»: не меньше 2 и строго больше «от» */
export function setDurationTo([from, to]: [number, number], value: number): [number, number] {
    return Number.isInteger(value) && value >= 2 && value > from ? [from, value] : [from, to];
}

export interface WhenForm {
    periods: Period[];
    duration: [number, number];
    isFullYearAcceptable: boolean;
    isApplicableAtTheEnd: boolean;
    applicationEndDate: Day | null;
    isWithoutApplicationDate: boolean;
}

/** Значения формы для новой вакансии (OfferWhenForm старого фронта) */
export const emptyWhenForm = (now: Day = today()): WhenForm => ({
    periods: [],
    duration: [...DEFAULT_DURATION],
    isFullYearAcceptable: false,
    isApplicableAtTheEnd: false,
    applicationEndDate: now,
    isWithoutApplicationDate: false,
});

/** Вакансия из GET /api/v1/vacancies/{id} (тип из OpenAPI) */
type VacancyRead = paths["/api/v1/vacancies/{id}"]["get"]["responses"][200]["content"]["application/json"];
type WhenApi = NonNullable<VacancyRead["when"]>;

/** Форма из сохранённой вакансии; нет блока «Когда» — значения по умолчанию */
export function whenFormFromApi(when: WhenApi | null | undefined, now: Day = today()): WhenForm {
    if (!when) return emptyWhenForm(now);
    const end = dayFromApi(when.applicationEndDate);
    const min = when.durationMinDays ?? DEFAULT_DURATION[0];
    const max = when.durationMaxDays ?? DEFAULT_DURATION[1];
    return {
        periods: (when.periods ?? []).map((period) => ({ start: dayFromApi(period.start) ?? now, end: dayFromApi(period.ending) ?? now })),
        duration: [min, max],
        isFullYearAcceptable: !!when.isFullYearAcceptable,
        isApplicableAtTheEnd: !!when.isApplicableAtTheEnd,
        applicationEndDate: end,
        isWithoutApplicationDate: !end,
    };
}

/**
 * Тело PATCH для блока «Когда». Круглый год — без периодов. Заполненный, но не
 * добавленный кнопкой период тоже сохраняется: в старом фронте он молча терялся.
 */
export function whenFormToApi(form: WhenForm, draft?: Period) {
    const complete = (period: Period): period is { start: Day; end: Day } => !!period.start && !!period.end;
    const periods = [...form.periods, ...(draft ? [draft] : [])].filter(complete).slice(0, MAX_PERIODS);
    return {
        periods: form.isFullYearAcceptable ? [] : periods.map((period) => ({ start: period.start, ending: period.end })),
        durationMinDays: form.duration[0],
        durationMaxDays: form.duration[1],
        applicationEndDate: form.isWithoutApplicationDate ? null : form.applicationEndDate,
        isFullYearAcceptable: form.isFullYearAcceptable,
        isApplicableAtTheEnd: form.isApplicableAtTheEnd,
    };
}

/**
 * «Принимаю в последний момент»: включили — даты окончания приёма заявок нет
 * (в старом фронте то же происходило через запутанное сравнение с концом
 * последнего периода). Пока переключатель включён, дату окончания не задать.
 */
export function toggleLastMoment(form: WhenForm): WhenForm {
    const on = !form.isApplicableAtTheEnd;
    return on
        ? { ...form, isApplicableAtTheEnd: true, isWithoutApplicationDate: true, applicationEndDate: null }
        : { ...form, isApplicableAtTheEnd: false };
}

/** «Нет даты окончания»: выключили — дата окончания сегодня; при «последнем моменте» не переключается */
export function toggleNoEndDate(form: WhenForm, now: Day = today()): WhenForm {
    if (form.isApplicableAtTheEnd) return form;
    return form.isWithoutApplicationDate
        ? { ...form, isWithoutApplicationDate: false, applicationEndDate: now }
        : { ...form, isWithoutApplicationDate: true, applicationEndDate: null };
}

/* ── Шаг «Где» ──────────────────────────────────────────────────────────── */

/** Точка из геокодера: название, уточнение (город, страна), долгота и широта */
export interface GeoPlace {
    name: string;
    description: string;
    longitude: number;
    latitude: number;
}

/** Подпись адреса, как в старом фронте: «уточнение, название» */
export const placeLabel = (place: Pick<GeoPlace, "name" | "description">) => (place.description ? `${place.description}, ${place.name}` : place.name);

const record = (value: unknown): Record<string, unknown> | null => (value && typeof value === "object" ? value as Record<string, unknown> : null);

/**
 * Точки из ответа /api/v1/geocode. Бэкенд пересылает ответ геокодера Яндекса
 * как есть, в OpenAPI его схемы нет — поэтому разбор с проверкой каждого поля,
 * а не приведение типа.
 */
export function parseGeocode(json: unknown): GeoPlace[] {
    const collection = record(record(record(json)?.response)?.GeoObjectCollection);
    const members = Array.isArray(collection?.featureMember) ? collection.featureMember : [];
    return members.flatMap((member: unknown) => {
        const geo = record(record(member)?.GeoObject);
        const pos = record(geo?.Point)?.pos;
        const name = geo?.name;
        if (typeof name !== "string" || typeof pos !== "string") return [];
        const [longitude, latitude] = pos.split(" ").map(Number);
        if (longitude === undefined || latitude === undefined || !Number.isFinite(longitude) || !Number.isFinite(latitude)) return [];
        return [{ name, description: typeof geo?.description === "string" ? geo.description : "", longitude, latitude }];
    });
}

/** Центр карты по умолчанию — Казань (ymapsDefaultLocation старого фронта), [широта, долгота] */
export const DEFAULT_MAP_CENTER: [number, number] = [55.7887, 49.1221];

/** Язык геокодера (getGeoObjectCollection старого фронта) */
export const GEOCODER_LANG: Record<Locale, string> = { ru: "ru_RU", en: "en_US", es: "es_ES" };

/** Слова для подписи срока: ключи when.день/дня/дней/месяц/месяца/месяцев словаря offer */
export interface DurationWords { day: string; days2: string; days5: string; month: string; months2: string; months5: string }

/**
 * Подпись бегунка срока участия (useFormatMonthDay старого фронта): месяц — 31
 * день; «30 дней», «1 месяц, 9 дней», «2 месяца». Склонение дней — как было
 * (21 — «день», 22–24 — «дня»), лишние пробелы старой подписи убраны.
 */
export function durationLabel(value: number, w: DurationWords): string {
    const months = Math.floor(value / 31);
    const days = value % 31;
    const dayWord = days === 1 || days === 21 ? w.day : (days >= 2 && days <= 4) || (days >= 22 && days <= 24) ? w.days2 : w.days5;
    const monthWord = months === 1 ? w.month : months >= 2 && months <= 4 ? w.months2 : w.months5;
    if (!months) return `${days} ${dayWord}`;
    return days ? `${months} ${monthWord}, ${days} ${dayWord}` : `${months} ${monthWord}`;
}

/** Метки под бегунком (OfferWhenSlider в узком варианте — он в старом фронте показывался всегда) */
export const DURATION_MARKS = [
    { value: 1, key: "when.1 день" },
    { value: 30, key: "when.1 месяц" },
    { value: 62, key: "when.2 месяца" },
    { value: 124, key: "when.4 месяца" },
    { value: 186, key: "when.6 месяцев" },
] as const;

/* ── Шаг «Кто нужен» ───────────────────────────────────────────────────── */

/** Языки (shared/data/languages старого фронта): значение уходит в API, подпись — ключ словаря offer */
export const LANGUAGES = [
    ["not_matter", "whoNeeds.Не важен"],
    ["English", "whoNeeds.Английский"],
    ["Русский", "whoNeeds.Русский"],
    ["Español", "whoNeeds.Испанский"],
    ["中文", "whoNeeds.Китайский"],
    ["Deutsch", "whoNeeds.Немецкий"],
    ["Italiano", "whoNeeds.Итальянский"],
    ["Français", "whoNeeds.Французский"],
    ["Português", "whoNeeds.Португальский"],
    ["Türkçe", "whoNeeds.Турецкий"],
    ["العربية", "whoNeeds.Арабский"],
    ["Svenska", "whoNeeds.Шведский"],
    ["Dansk", "whoNeeds.Датский"],
    ["Norsk", "whoNeeds.Норвежский"],
    ["Українська", "whoNeeds.Украинский"],
    ["עברית", "whoNeeds.Иврит"],
] as const;

export const LANGUAGE_LEVELS = [
    ["not_matter", "whoNeeds.Не важен"],
    ["beginner", "whoNeeds.Начальный"],
    ["elementary", "whoNeeds.Элементарный"],
    ["lower_intermediate", "whoNeeds.Слабый средний уровень"],
    ["upper_intermediate", "whoNeeds.Выше среднего"],
    ["advanced", "whoNeeds.Продвинутый"],
    ["proficiency", "whoNeeds.В совершенстве"],
] as const;

export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number][0];
export interface RequiredLanguage { language: string; languageLevel: LanguageLevel }
export type Gender = "male" | "female" | "other";
export type ReceptionPlace = "any" | "foreigners" | "compatriot";

/** Возраст: от 12 (MINIMAL_AGE_FOR_VOLUNTEER), по умолчанию 12–18, 100 — «и старше» (NO_AGE_LIMIT) */
export const AGE_MIN = 12;
export const AGE_DEFAULT_MAX = 18;
export const AGE_NO_LIMIT = 100;
export const MAX_LANGUAGES = 10;
export const MAX_VOLUNTEER_PLACES = 999;
export const ADDITIONAL_INFO_MAX = 1000;

export interface WhoNeedsForm {
    gender: Gender[];
    ageMin: number;
    ageMax: number;
    languages: RequiredLanguage[];
    needAllLanguages: boolean;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo: string;
}

export const emptyWhoNeedsForm = (): WhoNeedsForm => ({
    gender: [],
    ageMin: AGE_MIN,
    ageMax: AGE_DEFAULT_MAX,
    languages: [],
    needAllLanguages: false,
    volunteerPlaces: 0,
    receptionPlace: "any",
    additionalInfo: "",
});

const LEVELS = new Set<string>(LANGUAGE_LEVELS.map(([value]) => value));
const isLevel = (value: string): value is LanguageLevel => LEVELS.has(value);

type WhoNeedsApi = NonNullable<VacancyRead["howNeeds"]>;

export function whoNeedsFromApi(value: WhoNeedsApi | null | undefined): WhoNeedsForm {
    const empty = emptyWhoNeedsForm();
    if (!value) return empty;
    return {
        gender: value.gender ?? [],
        ageMin: value.ageMin ?? empty.ageMin,
        ageMax: value.ageMax ?? empty.ageMax,
        languages: (value.requiredLanguages ?? []).map((item) => ({ language: item.language, languageLevel: isLevel(item.languageLevel) ? item.languageLevel : "not_matter" })),
        needAllLanguages: !!value.needAllLanguages,
        volunteerPlaces: value.volunteerPlaceCount ?? 0,
        receptionPlace: value.receptionPlace ?? "any",
        additionalInfo: value.additionalInfo ?? "",
    };
}

export function whoNeedsToApi(form: WhoNeedsForm) {
    return {
        gender: form.gender,
        ageMin: form.ageMin,
        ageMax: form.ageMax,
        requiredLanguages: form.languages,
        needAllLanguages: form.needAllLanguages,
        volunteerPlaceCount: form.volunteerPlaces,
        receptionPlace: form.receptionPlace,
        additionalInfo: form.additionalInfo,
    };
}

/** Обязательные поля (старый фронт): хотя бы один пол и не ноль волонтёрских мест */
export function whoNeedsErrors(form: WhoNeedsForm): { gender: boolean; volunteerPlaces: boolean } {
    return { gender: form.gender.length === 0, volunteerPlaces: form.volunteerPlaces <= 0 };
}

/** «Возраст от»: число не меньше «до» тянет «до» за собой (Age старого фронта), но не выше 100 */
export function setAgeMin(form: Pick<WhoNeedsForm, "ageMin" | "ageMax">, value: number) {
    return value >= form.ageMax ? { ageMin: value, ageMax: Math.min(value, AGE_NO_LIMIT) } : { ageMin: value, ageMax: form.ageMax };
}

/** Уход из поля «от»: меньше 12 или больше 100 — 12 (как в старом), «до» не меньше «от» и не больше 100 */
export function commitAgeMin(form: Pick<WhoNeedsForm, "ageMin" | "ageMax">) {
    const ageMin = Number.isInteger(form.ageMin) && form.ageMin >= AGE_MIN && form.ageMin <= AGE_NO_LIMIT ? form.ageMin : AGE_MIN;
    return { ageMin, ageMax: Math.min(Math.max(ageMin, form.ageMax), AGE_NO_LIMIT) };
}

/**
 * Уход из поля «до»: меньше «от» — равно «от», больше 100 — 100 («и старше»).
 * В старом фронте «до» меньше «от» сбрасывало «от» на 12 — получался бессмысленный возраст.
 */
export function commitAgeMax(form: Pick<WhoNeedsForm, "ageMin" | "ageMax">) {
    const ageMax = !Number.isInteger(form.ageMax) || form.ageMax < form.ageMin ? form.ageMin : Math.min(form.ageMax, AGE_NO_LIMIT);
    return { ageMin: form.ageMin, ageMax };
}

/** «Без ограничения по возрасту»: включили — «до» 100, выключили — «до» равно «от» */
export const toggleNoAgeLimit = (form: Pick<WhoNeedsForm, "ageMin" | "ageMax">) => ({ ageMin: form.ageMin, ageMax: form.ageMax >= AGE_NO_LIMIT ? form.ageMin : AGE_NO_LIMIT });

/** Языки, которые можно выбрать в строке: без уже выбранных в других строках; «Не важен» — только в строке добавления */
export function languageChoices(selected: RequiredLanguage[], current: string, allowNotMatter: boolean): string[] {
    const taken = new Set(selected.map((item) => item.language).filter((language) => language !== current));
    return LANGUAGES.map(([value]) => value).filter((value) => !taken.has(value) && (allowNotMatter || value !== "not_matter"));
}

/** «Добавить язык»: нужен выбранный язык, не больше десяти */
export function addLanguage(languages: RequiredLanguage[], draft: RequiredLanguage): RequiredLanguage[] | null {
    if (draft.language === "not_matter" || languages.length >= MAX_LANGUAGES || languages.some((item) => item.language === draft.language)) return null;
    return [...languages, draft];
}

/** Подписи языков и уровней из словаря offer по значению */
export const languageLabels = (t: (key: string) => string) => ({
    languages: Object.fromEntries(LANGUAGES.map(([code, key]) => [code, t(key)])),
    levels: Object.fromEntries(LANGUAGE_LEVELS.map(([code, key]) => [code, t(key)])),
});

/* ── Шаг «Описание» ─────────────────────────────────────────────────────── */

export const SHORT_DESCRIPTION_MAX = 250;
export const FULL_DESCRIPTION_MAX = 3000;
export const MAX_CATEGORIES = 5;
export const MAX_GALLERY = 10;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
/** Обложка — не меньше 1280×720 (ImageInput старого фронта) */
export const COVER_MIN_WIDTH = 1280;
export const COVER_MIN_HEIGHT = 720;
const IMAGE_EXTENSIONS = [".png", ".jpeg", ".jpg", ".webp"];

export interface DescriptionForm {
    title: string;
    categoryIds: number[];
    shortDescription: string;
    fullDescription: string;
}

export type DescriptionErrors = Partial<Record<keyof DescriptionForm | "cover", true>>;

/** Обязательно всё: название, хотя бы одна категория, оба описания и обложка */
export function descriptionErrors(form: DescriptionForm, hasCover: boolean): DescriptionErrors {
    const errors: DescriptionErrors = {};
    if (!form.title.trim()) errors.title = true;
    if (!form.categoryIds.length) errors.categoryIds = true;
    if (!form.shortDescription.trim()) errors.shortDescription = true;
    if (!form.fullDescription.trim()) errors.fullDescription = true;
    if (!hasCover) errors.cover = true;
    return errors;
}

/** Категория по щелчку: снять, если выбрана; добавить, если выбрано меньше пяти */
export function toggleCategory(selected: number[], id: number): number[] {
    if (selected.includes(id)) return selected.filter((item) => item !== id);
    return selected.length >= MAX_CATEGORIES ? selected : [...selected, id];
}

/** Проверка файла обложки до загрузки: формат, размер; ключ ошибки словаря offer или null */
export function coverFileError(name: string, size: number): string | null {
    const extension = name.toLowerCase().slice(name.lastIndexOf("."));
    if (!IMAGE_EXTENSIONS.includes(extension)) return "description.Неверный формат файла";
    if (size > IMAGE_MAX_BYTES) return "description.Размер файла превышает 5МБ";
    return null;
}

/** Размер картинки обложки: меньше 1280×720 — ключ ошибки */
export const coverSizeError = (width: number, height: number): string | null => (width < COVER_MIN_WIDTH || height < COVER_MIN_HEIGHT ? "description.Неверный размер изображения. Минимум 1280x720" : null);
