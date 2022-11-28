import { useRoutes } from "react-router-dom";

import MainPage from "@/pages/MainPage/MainPage";

import { AppRoutesEnum } from "@/routes/types";

export const PublicRoutes = () =>
    useRoutes([
        {
            path: AppRoutesEnum.HOME,
            element: <MainPage />,
        },
    ]);
