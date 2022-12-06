import PrivateRoute from "@/hok/PrivateRoute/PrivateRoute";
import React from "react";
import { useRoutes } from "react-router-dom";

import CategoriesPage from "@/pages/CategoriesPage/CategoriesPage";
import ConfirmEmailPage from "@/pages/ConfirmEmailPage/ConfirmEmailPage";
import ConfirmEmailSuccessPage from "@/pages/ConfirmEmailSuccessPage/ConfirmEmailSuccessPage";
import MainPage from "@/pages/MainPage/MainPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage/ResetPasswordPage";
import ResetPasswordVerifyPage from "@/pages/ResetPasswordVerifyPage/ResetPasswordVerifyPage";
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
        {
            path: AppRoutesEnum.CONFIRM_EMAIL_SUCCESS,
            element: <ConfirmEmailSuccessPage />,
        },
        {
            path: AppRoutesEnum.RESET_PASSWORD_VERIFY,
            element: <ResetPasswordVerifyPage />,
        },
        {
            path: AppRoutesEnum.CATEGORIES,
            element: <PrivateRoute Component={CategoriesPage} />,
        },
    ]);
