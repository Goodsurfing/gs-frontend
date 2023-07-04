import {
    createContext, useCallback, useEffect, useMemo, useRef, useState,
    Suspense,
} from "react";
import { useTranslation } from "react-i18next";
import {
    Route, Routes, useLocation, useNavigate,
} from "react-router-dom";
import { getDefaultLanguage } from "../../model/services/RoutingHelpers/RoutingHelpers";
import { getMainPageUrl } from "../../model/services/AppUrls/AppUrls";
import { RouteWithChildrenProps } from "../../model/types/langRouter";
import Preloader from "@/shared/ui/Preloader/Preloader";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import App from "@/app/App";
import { allRoutes } from "../../model/config/RoutesConfig";

export const LocaleContext = createContext({
    locale: "",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLocale: (newLocale: string) => {},
});

export const LangRouter = () => {
    const { i18n } = useTranslation();
    const { pathname, search, hash } = useLocation();
    const navigate = useNavigate();
    const availableLocales = ["ru", "en", "es"];
    const defaultLocale = "ru";
    const pathnameLocale = pathname.substring(1, 3).toLowerCase();
    const [locale, setLocale] = useState(defaultLocale);
    const loaderTimerRef = useRef<any>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        loaderTimerRef.current = setTimeout(() => {
            setLoading(false);
            clearTimeout(loaderTimerRef.current);
        }, 300);
    });

    const setLanguageHandler = (lang: string) => {
        // set language attribute on HTML element
        document.documentElement.setAttribute("lang", lang);

        if (lang === "ru") {
            i18n.changeLanguage("ru");
        } else {
            i18n.changeLanguage("en");
        }
    };

    useEffect(() => {
        let lang = defaultLocale;

        if (availableLocales.includes(pathnameLocale)) {
            lang = pathnameLocale;
            setLanguageHandler(lang);
        } else if (pathname === "/") {
            setLanguageHandler(lang);
        }
        // eslint-disable-next-line
      }, [locale]);

    const updateLocale = useCallback((newLocale: string) => {
        const newPath = `/${newLocale}${pathname.substring(3)}`;

        if (locale !== newLocale) {
            if (newPath === `/${newLocale}/` || newPath === `/${newLocale}` || pathname === "/") {
                navigate(getMainPageUrl(newLocale));
            } else {
                navigate(`${newPath}${hash}${search}`);
            }
            setLocale(newLocale);
        } else if (newPath === `/${newLocale}/` || newPath === `/${newLocale}` || pathname === "/") {
            navigate(getMainPageUrl(newLocale));
        }
    }, [hash, locale, navigate, pathname, search]);

    useEffect(() => {
        if (availableLocales.includes(pathnameLocale)) {
            updateLocale(pathnameLocale);
        } else if (pathname === "/") {
            updateLocale(defaultLocale);
        }
        // eslint-disable-next-line
      }, [pathname]);

    const renderRouteWithChildren = (
        routes: RouteWithChildrenProps[],
    ) => routes.map((route, index) => (
        <Route key={index} path={route.path(locale)} element={route.element}>
            {route.children && renderRouteWithChildren(route.children)}
        </Route>
    ));

    const value = useMemo(() => ({ locale, setLocale: updateLocale }), [locale, updateLocale]);

    if (isLoading) {
        return (
            <Preloader />
        );
    }

    return (
        <LocaleContext.Provider value={value}>
            <Suspense fallback={<Preloader />}>
                <Routes>
                    <Route path={`/${locale}`} element={<App />}>
                        {renderRouteWithChildren(allRoutes)}
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </LocaleContext.Provider>
    );
};
