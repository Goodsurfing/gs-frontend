import { useContext, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { localeFromPath, withLocalePath } from "@/shared/config/routes/localePath";

import { LocaleContext, Locale } from "./LocaleProvider";

/**
 * Язык берётся из адреса: /en/… и /es/… — английский и испанский, всё
 * остальное — русский (у него префикса нет, см. shared/config/routes/localePath).
 */
export const useLocale = () => {
    const { locale, setLocale } = useContext(LocaleContext);

    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const { pathname, search, hash } = useLocation();
    const pathnameLocale = localeFromPath(pathname);

    /** Переключение языка: та же страница на другом языке. */
    const handleLocaleUpdate = useCallback((newLocale: Locale | string) => {
        if (newLocale === locale) return;
        navigate(`${withLocalePath(pathname, newLocale)}${search}${hash}`);
        setLocale(newLocale as Locale);
    }, [hash, locale, navigate, pathname, search, setLocale]);

    useEffect(() => {
        if (pathnameLocale !== locale) {
            setLocale(pathnameLocale);
        }
    }, [locale, pathnameLocale, setLocale]);

    useEffect(() => {
        document.documentElement.setAttribute("lang", pathnameLocale);
        if (i18n.language !== pathnameLocale) {
            i18n.changeLanguage(pathnameLocale);
        }
    }, [i18n, pathnameLocale]);

    return { locale, updateLocale: handleLocaleUpdate };
};
