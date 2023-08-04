import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { LANGUAGE_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
import LocalStorageManager from "@/shared/lib/localstorage/LocalStorageManager";

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
    name: "customLocalStorageDetector",
    lookup() {
        return LocalStorageManager.getItem(LANGUAGE_LOCALSTORAGE_KEY);
    },
});

i18n.use(Backend)
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "ru",
        supportedLngs: ["ru", "en", "es"],
        detection: {
            order: ["customLocalStorageDetector", "navigator"],
            caches: [],
        },
        debug: __IS_DEV__,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
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
