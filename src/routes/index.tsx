import { useRoutes } from "react-router-dom";

import MainPage from "@/pages/MainPage/MainPage";
import SignInPage from "@/pages/SignInPage/SignInPage";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";

import { AppRoutesEnum } from "@/routes/types";

export const PublicRoutes = () =>
    useRoutes([
        {
            path: AppRoutesEnum.HOME,
            element: <MainPage />,
        },
        {
            path: AppRoutesEnum.SIGNUP,
            element: <SignUpPage />,
        },
        {
            path: AppRoutesEnum.SIGNIN,
            element: <SignInPage />,
        },
    ]);
