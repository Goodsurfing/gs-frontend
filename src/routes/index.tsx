import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "@/hoc/PrivateRoute/PrivateRoute";

import ConfirmEmailPage from "@/pages/ConfirmEmailPage/ConfirmEmailPage";
import ConfirmEmailSuccessPage from "@/pages/ConfirmEmailSuccessPage/ConfirmEmailSuccessPage";
import MainPage from "@/pages/MainPage/MainPage";
import ProfilePage from "@/pages/ProfilePages/ProfilePage/ProfilePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage/ResetPasswordPage";
import ResetPasswordVerifyPage from "@/pages/ResetPasswordVerifyPage/ResetPasswordVerifyPage";
import SignInPage from "@/pages/SignInPage/SignInPage";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/:ln" element={<MainPage />} />
            <Route path="/:ln/signup" element={<SignUpPage />} />
            <Route path="/:ln/signin" element={<SignInPage />} />
            <Route path="/:ln/reset-password" element={<ResetPasswordPage />} />
            <Route
                path="/:ln/reset-password-verify"
                element={<ResetPasswordVerifyPage />}
            />
            <Route path="/:ln/confirm-email" element={<ConfirmEmailPage />} />
            <Route
                path="/:ln/confirm-email-success"
                element={<ConfirmEmailSuccessPage />}
            />
            <Route path="/:ln/profile">
                <Route
                    path="info"
                    element={<PrivateRoute Component={ProfilePage} />}
                />
                <Route
                    path="reset-password"
                    element={<PrivateRoute Component={ProfilePage} />}
                />
            </Route>
        </Routes>
    );
};
