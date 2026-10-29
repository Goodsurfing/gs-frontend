import {
    Suspense, useState, useEffect, useRef,
} from "react";
import {
    Navigate, Route, Routes, useLocation,
} from "react-router-dom";

import { RouteType } from "../../model/types/langRouter";
import Preloader from "@/shared/ui/Preloader/Preloader";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import { allRoutes } from "../../model/config/RoutesConfig";
import { useLocale } from "@/app/providers/LocaleProvider";
import { isLegacyRuPath, localePrefix, stripLocale } from "@/shared/config/routes/localePath";

export const defaultLocale = "ru";
export const availableLocales = ["ru", "en", "es"];

export const LangRouter = () => {
    const { locale } = useLocale();
    const { pathname, search, hash } = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    const loaderTimerRef = useRef<any>();

    useEffect(() => {
        loaderTimerRef.current = setTimeout(() => {
            setIsLoading(false);
            clearTimeout(loaderTimerRef.current);
        }, 400);
    }, []);

    const renderRouteWithChildren = (
        routes: RouteType[],
    ) => routes.map((route) => {
        if (route.index) {
            return (
                <Route
                    key={route.label}
                    index
                    element={route.element}
                />
            );
        }
        return (
            <Route
                key={route.label}
                path={route.path!(locale)}
                element={route.element}
            >
                {route.children && renderRouteWithChildren(route.children)}
            </Route>
        );
    });

    // Старый адрес /ru/… (на стенде и в проде его перенаправляет nginx, здесь —
    // запасной путь для локальной разработки и переходов внутри приложения)
    if (isLegacyRuPath(pathname)) {
        return <Navigate replace to={`${stripLocale(pathname)}${search}${hash}`} />;
    }

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <Suspense fallback={<Preloader />}>
            <Routes>
                {/* У русского префикса нет (/offers-map), у en/es — /en/…, /es/… */}
                <Route path={localePrefix(locale) || "/"}>
                    {renderRouteWithChildren(allRoutes)}
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};
