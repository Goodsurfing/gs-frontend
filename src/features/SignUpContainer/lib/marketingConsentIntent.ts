/**
 * Отметка «Хочу получать письма» на странице регистрации (GS-203). Вход через
 * VK уводит на сайт VK и возвращает обратно — состояние формы теряется,
 * поэтому отметка хранится в sessionStorage до возвращения.
 */
const KEY = "gs.marketingConsentIntent";

export const saveMarketingConsentIntent = (consent: boolean) => {
    try {
        if (consent) sessionStorage.setItem(KEY, "1");
        else sessionStorage.removeItem(KEY);
    } catch {
        // приватный режим без sessionStorage — согласие просто не перенесётся
    }
};

/** Отметка с прошлого шага (и сразу забывается). */
export const takeMarketingConsentIntent = (): boolean => {
    try {
        const value = sessionStorage.getItem(KEY) === "1";
        sessionStorage.removeItem(KEY);
        return value;
    } catch {
        return false;
    }
};

export const hasMarketingConsentIntent = (): boolean => {
    try {
        return sessionStorage.getItem(KEY) === "1";
    } catch {
        return false;
    }
};

type Translate = (key: string) => string;

/**
 * Текст галочки согласия ровно так, как его видит человек (на его языке), —
 * уходит в журнал согласий как доказательство (38-ФЗ).
 */
export const marketingConsentWording = (t: Translate): string => [
    t("login.Хочу получать письма о новых проектах, акциях и новостях Гудсёрфинга"),
    t("login.marketingConsentHint"),
].join(" ");
