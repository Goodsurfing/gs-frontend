import React, { Suspense, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { AppRoutesProps, routeConfig } from "../../model/config/RouterConfig";
import { RequireAuth } from "../RequireAuth/RequireAuth";

import Preloader from "@/shared/ui/Preloader/Preloader";

export const AppRouter = () => {
    const renderWithWrapper = useCallback((route: AppRoutesProps) => (
        <Route
            key={route.path}
            path={route.path}
            element={
                route.authOnly
                    ? <RequireAuth>{route.element}</RequireAuth>
                    : route.element
            }
        />
    ), []);
    return (
        <Suspense fallback={<Preloader />}>
            <Routes>
                {Object.values(routeConfig).map(renderWithWrapper)}
            </Routes>
        </Suspense>
    );
};
