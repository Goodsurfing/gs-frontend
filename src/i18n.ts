import translationEn from "./locales/en/translation.json";
import translationRu from "./locales/ru/translation.json";
import translationEs from "./locales/es/translation.json";


import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: translationEn
    },
    ru: {
        translation: translationRu
    },
    es: {
        translation: translationEs
    }
};

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        keySeparator: ".",
        backend: {
            loadPath: "locales/{{lng}}/translation.json"
        },
        fallbackLng: "ru",
        supportedLngs: ["ru", "en", "es"],
        detection: {
            order: ["querystring", "cookie", "path", "navigator"],
            caches: ["cookie"],
        },
        interpolation: {
            escapeValue: false,
        },
        debug: true
    });

export default i18n;
