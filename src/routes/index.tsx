import {useRoutes} from "react-router-dom";

import MainPage from "@/pages/MainPage/MainPage";

import {AppRoutesEnum} from "@/routes/types";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";

export const PublicRoutes = () =>
    useRoutes([
        {
            path: AppRoutesEnum.HOME,
            element: <MainPage />,
        },
        {
            path: AppRoutesEnum.SIGNUP,
            element: <SignUpPage />
        }
    ]);
