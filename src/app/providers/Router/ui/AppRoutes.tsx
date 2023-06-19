import React, { Suspense } from 'react';

import { Routes, Route } from 'react-router-dom';

import { routeConfig } from 'shared/config/RouteConfig/RouteConfig';
import { PageLoader } from 'widgets/PageLoader';

export const AppRouter = () => (
    <Suspense fallback={<PageLoader />}>
        <Routes>
            {Object.values(routeConfig).map(({ element, path }) => (
                <Route element={<div className="page-wrapper">{element}</div>} path={path} key={path} />
            ))}
        </Routes>
    </Suspense>
);
