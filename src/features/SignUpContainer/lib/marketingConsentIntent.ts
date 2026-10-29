/**
 * Отметка «Хочу получать письма» на странице регистрации (GS-203). По умолчанию
 * стоит (решение владельца 29.10.2026). Вход через VK уводит на сайт VK и
 * возвращает обратно — состояние формы теряется, поэтому выбор хранится в
 * sessionStorage: "1" — отмечено, "0" — снято; нет записи — по умолчанию отмечено.
 */
const KEY = "gs.marketingConsentIntent";

export const saveMarketingConsentIntent = (consent: boolean) => {
    try {
        sessionStorage.setItem(KEY, consent ? "1" : "0");
    } catch {
        // приватный режим без sessionStorage — останется значение по умолчанию
    }
};

const readIntent = (): boolean => {
    try {
        return sessionStorage.getItem(KEY) !== "0";
    } catch {
        return true;
    }
};

/** Выбор с прошлого шага (и сразу забывается). */
export const takeMarketingConsentIntent = (): boolean => {
    const value = readIntent();
    try {
        sessionStorage.removeItem(KEY);
    } catch {
        // нечего забывать
    }
    return value;
};

export const hasMarketingConsentIntent = (): boolean => readIntent();

type Translate = (key: string) => string;

/**
 * Текст галочки согласия ровно так, как его видит человек (на его языке), —
 * уходит в журнал согласий как доказательство (38-ФЗ).
 */
export const marketingConsentWording = (t: Translate): string => [
    t("login.Хочу получать письма о новых проектах, акциях и новостях Гудсёрфинга"),
    t("login.marketingConsentHint"),
].join(". ");
