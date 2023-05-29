import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { PageLoader } from "widgets/PageLoader";

import { routeConfig } from "../../config/RouteConfig";

export const AppRouter = () => (
    <Suspense fallback={<PageLoader />}>
        <Routes>
            {Object.values(routeConfig).map(({ element, path }) => (
                <Route element={<div className="page-wrapper">{element}</div>} path={path} key={path} />
            ))}
        </Routes>
    </Suspense>
);
