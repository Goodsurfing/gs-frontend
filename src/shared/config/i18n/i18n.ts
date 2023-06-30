import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        keySeparator: ".",
        fallbackLng: "ru",
        supportedLngs: ["ru", "en", "es"],
        detection: {
            order: ["customLocalStorageDetector", "navigator"],
            caches: [],
        },
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/public/locales/{{lng}}/{{ns}}.json",

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
