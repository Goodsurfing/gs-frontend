import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { localeFromPath } from "@/shared/config/routes/localePath";

// Язык — только из адреса (/en/…, /es/…, остальное — русский), как и в useLocale.
// Раньше он определялся по браузеру: при английском браузере на русской странице
// сначала грузился английский словарь, и часть интерфейса (меню кабинета
// организатора) успевала отрисоваться и остаться на английском.
const initialLanguage = typeof window === "undefined"
    ? "ru"
    : localeFromPath(window.location.pathname);

i18n.use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: "ru",
        lng: initialLanguage,
        supportedLngs: ["ru", "en", "es"],
        debug: __IS_DEV__,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            // Словари кэшируются браузером на час — версия сборки в URL, чтобы после
            // выкатки сразу подтягивались новые ключи, а не старые из кэша.
            loadPath: `/locales/{{lng}}/{{ns}}.json?v=${__BUILD_ID__}`,
        },
        react: {
            bindI18n: "languageChanged",
            bindI18nStore: "",
            transEmptyNodeValue: "",
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ["br", "strong", "i"],
            useSuspense: false,
        },
    });

export default i18n;
