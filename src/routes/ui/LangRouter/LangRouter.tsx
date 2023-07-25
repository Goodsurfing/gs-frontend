import {
    Suspense, useState, useEffect, useRef,
} from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { RouteWithChildrenProps } from "../../model/types/langRouter";
import Preloader from "@/shared/ui/Preloader/Preloader";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import { allRoutes } from "../../model/config/RoutesConfig";
import { useLocale } from "@/app/providers/LocaleProvider";

export const defaultLocale = "ru";
export const availableLocales = ["ru", "en", "es"];

export const LangRouter = () => {
    const { locale } = useLocale();
    const [isLoading, setIsLoading] = useState(true);

    const loaderTimerRef = useRef<any>();

    useEffect(() => {
        loaderTimerRef.current = setTimeout(() => {
            setIsLoading(false);
            clearTimeout(loaderTimerRef.current);
        }, 400);
    }, []);

    const renderRouteWithChildren = (
        routes: RouteWithChildrenProps[],
    ) => routes.map((route, index) => (
        <Route key={index} path={route.path(locale)} element={route.element}>
            {route.children && renderRouteWithChildren(route.children)}
        </Route>
    ));

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <Suspense fallback={<Preloader />}>
            <Routes>
                <Route path={`/${locale}`} element={<Outlet />}>
                    {renderRouteWithChildren(allRoutes)}
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};
