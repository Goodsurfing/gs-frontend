import { useContext, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import {
    LocaleContext, availableLocales, defaultLocale, Locale,
} from "./LocaleProvider";

export const useLocale = () => {
    const { locale, setLocale } = useContext(LocaleContext);

    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const { pathname, search, hash } = useLocation();
    const pathnameLocale: Locale | string = pathname.substring(1, 3).toLowerCase();

    const handleLocaleUpdate = useCallback((newLocale: Locale | string) => {
        const newPath = `/${newLocale}${pathname.substring(3)}`;

        if (newPath === `/${newLocale}/` || newPath === `/${newLocale}` || pathname === "/") {
            navigate(getMainPageUrl(newLocale));
        }

        if (locale !== newLocale) {
            if (newPath === `/${newLocale}/` || newPath === `/${newLocale}` || pathname === "/") {
                navigate(getMainPageUrl(newLocale));
            } else {
                navigate(`${newPath}${hash}${search}`);
            }
            setLocale(newLocale as Locale);
        }
    }, [hash, locale, navigate, pathname, search, setLocale]);

    const setLanguageHandler = useCallback((lang: string) => {
        document.documentElement.setAttribute("lang", lang);

        if (lang === "ru") {
            i18n.changeLanguage("ru");
        }
        if (lang === "en") {
            i18n.changeLanguage("en");
        }
        if (lang === "es") {
            i18n.changeLanguage("es");
        }
    }, [i18n]);

    useEffect(() => {
        if (availableLocales.includes(pathnameLocale as Locale)) {
            handleLocaleUpdate(pathnameLocale);
        } else if (pathname === "/") {
            handleLocaleUpdate(defaultLocale);
        }
    }, [handleLocaleUpdate, pathname, pathnameLocale]);

    useEffect(() => {
        let lang = defaultLocale;
        if (availableLocales.includes(pathnameLocale as Locale)) {
            lang = pathnameLocale;
            setLanguageHandler(lang);
        } else if (pathname === "/") {
            setLanguageHandler(lang);
        }
    }, [locale, pathname, pathnameLocale, setLanguageHandler]);

    return { locale, updateLocale: handleLocaleUpdate };
};
