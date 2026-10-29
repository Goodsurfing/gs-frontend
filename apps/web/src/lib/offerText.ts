import type { Translate } from "@/i18n/dictionary";

/**
 * Подписи страницы вакансии — те же ключи словарей, что у старого фронта
 * (entities/Offer, shared/hooks, shared/data). t — словарь «offer», если не
 * сказано иное.
 */

/** Возраст «без ограничения сверху» (shared/constants/offerAge) */
export const NO_AGE_LIMIT = 100;

export function gendersText(genders: string[], t: Translate): string {
    const known = new Set(["male", "female", "other"]);
    return genders.length > 0
        ? genders.map((gender) => (known.has(gender) ? t(`personalOffer.${gender}`) : gender)).join(", ")
        : t("personalOffer.notSpecified");
}

export function ageText(min: number, max: number, t: Translate): string {
    return max >= NO_AGE_LIMIT
        ? t("whoNeeds.от {{min}}", { min })
        : t("whoNeeds.от {{min}} до {{max}}", { min, max });
}

export function receptionPlaceText(place: string, t: Translate): string | null {
    if (place === "foreigners") return t("whoNeeds.Только иностранцев");
    if (place === "compatriot") return t("whoNeeds.Только из моей страны");
    return null;
}

const LANGUAGES: Record<string, string> = {
    not_matter: "Не важен",
    English: "Английский",
    Русский: "Русский",
    Español: "Испанский",
    中文: "Китайский",
    Deutsch: "Немецкий",
    Italiano: "Итальянский",
    Français: "Французский",
    Português: "Португальский",
    Türkçe: "Турецкий",
    العربية: "Арабский",
    Svenska: "Шведский",
    Dansk: "Датский",
    Norsk: "Норвежский",
    Українська: "Украинский",
    עברית: "Иврит",
};

const LEVELS: Record<string, string> = {
    not_matter: "Не важен",
    beginner: "Начальный",
    elementary: "Элементарный",
    lower_intermediate: "Слабый средний уровень",
    upper_intermediate: "Выше среднего",
    advanced: "Продвинутый",
    proficiency: "В совершенстве",
};

/**
 * Языки «язык/уровень» (useFormatLanguages старого фронта); пустой список —
 * null (блок без текста), первый «не важен» — одна подпись.
 */
export function languagesText(
    languages: { language: string; languageLevel: string }[],
    t: Translate,
): { language: string; level: string }[] | string | null {
    if (languages.length === 0) return null;
    if (languages[0]?.language === "not_matter") return t("whoNeeds.Не важен");
    return languages.map(({ language, languageLevel }) => ({
        language: LANGUAGES[language] ? t(`whoNeeds.${LANGUAGES[language]}`) : language,
        level: LEVELS[languageLevel] ? t(`whoNeeds.${LEVELS[languageLevel]}`) : languageLevel,
    }));
}

export function timeTypeText(timeType: string, t: Translate): string {
    return ["week", "day", "month"].includes(timeType) ? t(`whatToDo.${timeType}`) : timeType;
}

const CURRENCY: Record<string, string> = { RUB: "₽", USD: "$", EUR: "€" };

/** «500 ₽» (combineToFullPayment старого фронта) */
export function money(amount: number, currency: string): string {
    return `${amount} ${CURRENCY[currency] ?? "undefined"}`;
}

const SKILLS: Record<string, string> = {
    Администрирование: "admin",
    "Приготовление еды": "cooking",
    Вождение: "driving",
    Домоводство: "housing",
    Декорирование: "decor",
    "Туристический гид": "tourism",
    Искусство: "art",
    "Сельское хозяйство": "farming",
    "Социальная работа": "social",
    "Работа с видео": "recording",
    Садоводство: "gardening",
    Музыка: "music",
    Фотография: "photo",
    "Ночная смена": "night_job",
    Спорт: "sport",
};

/** Навык из справочника API; t — общий словарь. Неизвестный — пусто, как в старом фронте. */
export function skillName(name: string, t: Translate): string {
    const key = SKILLS[name];
    return key ? t(`skills.${key}`) : "";
}

const CONDITIONS = new Set([
    "Отдельный дом", "Комната", "Койко-место", "Палатка", "Место под палатку",
    "Полный пансион", "Завтрак включен", "Продукты", "Вегетарианское",
    "Полная оплата проезда", "Компенсация стоимости проезда", "Частичная компенсация затрат",
    "Заброска из пункта сбора", "Трансфер из/в аэропорта/вокзала",
    "Горячая вода", "Интернет и wi-fi", "Электричество", "Кондиционер", "Баня/сауна",
    "Мастер-классы/ обучающие курсы", "Экскурсии", "Катание на лошадях", "Языковые уроки", "Другое",
]);

/** Жильё, питание, проезд из справочника API. Неизвестное — пусто, как в старом фронте. */
export function conditionName(name: string, t: Translate): string {
    return CONDITIONS.has(name) ? t(`conditions.${name}`) : "";
}

/** Удобства (conveniences) — свой список с иконками; порядок как в старом фронте. */
export const GOODS = [
    { id: "hot-water", text: "Горячая вода", icon: "hot_water" },
    { id: "wi-fi", text: "Интернет и wi-fi", icon: "wi-fi" },
    { id: "electricity", text: "Электричество", icon: "electricity" },
    { id: "conditioner", text: "Кондиционер", icon: "air-conditioning" },
    { id: "bath", text: "Баня/сауна", icon: "bath" },
] as const;

/** Дополнительные возможности (additionalFeatures) */
export const EXTRA_FEATURES = [
    { id: "master_class", text: "Мастер-классы/ обучающие курсы", icon: "class" },
    { id: "excursions", text: "Экскурсии", icon: "excursions" },
    { id: "horses", text: "Катание на лошадях", icon: "horsing" },
    { id: "languages", text: "Языковые уроки", icon: "language" },
    { id: "additional", text: "Другое", icon: "other" },
] as const;

/** Требования «последних штрихов» (finishingTouche.additionalConditions) */
export const EXTRA_CONDITIONS = [
    { id: "allow-kids", text: "Можно с детьми", icon: "withKids" },
    { id: "allow-pets", text: "Можно с животными", icon: "withAnimals" },
    { id: "couples", text: "Принимаем парами", icon: "withPairs" },
    { id: "students", text: "Можно студентам", icon: "withStudents" },
    { id: "vegetarian", text: "Только для вегетарианцев", icon: "forVegans" },
    { id: "adult-only", text: "Только для совершеннолетних", icon: "adults" },
] as const;

const ORGANIZATION_TYPES = new Set(["ИП", "ОАО", "ООО", "ООПТ", "НКО", "Другое"]);

/** Тип организации; t — словарь «host». */
export function organizationType(type: string, t: Translate): string {
    return ORGANIZATION_TYPES.has(type) ? t(`hostDescription.${type}`) : type;
}

export interface ParticipateLabels {
    participate: string;
    closed: string;
    becomeVolunteer: string;
    /** «Вы отправили заявку», «Вы участвуете», «Ваша заявка отклонена» — по тексту из API */
    states: Record<string, string>;
}

/** Состояния заявки, которые API присылает в textParticipate */
export const PARTICIPATE_STATES = ["Вы отправили заявку", "Вы участвуете", "Ваша заявка отклонена"] as const;

/**
 * Надпись на кнопке «Участвовать» (PersonalCard старого фронта): закрытая
 * вакансия; вошёл, но не волонтёр; состояние заявки; иначе «Участвовать».
 */
export function participateText(
    { closed, needVolunteerRole, textParticipate }: { closed: boolean; needVolunteerRole: boolean; textParticipate?: string | null },
    labels: ParticipateLabels,
): string {
    if (closed) return labels.closed;
    if (needVolunteerRole) return labels.becomeVolunteer;
    return (textParticipate && labels.states[textParticipate]) || labels.participate;
}
