import { useRoutes } from "react-router-dom";

import ConfirmEmailPage from "@/pages/ConfirmEmailPage/ConfirmEmailPage";
import MainPage from "@/pages/MainPage/MainPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage/ResetPasswordPage";
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
        {
            path: AppRoutesEnum.RESET,
            element: <ResetPasswordPage />,
        },
        {
            path: AppRoutesEnum.CONFIRM_EMAIL,
            element: <ConfirmEmailPage />,
        },
    ]);
