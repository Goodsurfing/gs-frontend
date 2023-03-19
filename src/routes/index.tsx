import PrivateRoute from "@/hoc/PrivateRoute/PrivateRoute";
import React from "react";
import { Route, Routes } from "react-router-dom";

import ConfirmEmailPage from "@/pages/ConfirmEmailPage/ConfirmEmailPage";
import ConfirmEmailSuccessPage from "@/pages/ConfirmEmailSuccessPage/ConfirmEmailSuccessPage";
import HostMainInfoPage from "@/pages/HostRegistrationPages/HostMainInfoPage/HostMainInfoPage";
import MainPage from "@/pages/MainPage/MainPage";
import ProfilePage from "@/pages/ProfilePages/ProfilePage/ProfilePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage/ResetPasswordPage";
import ResetPasswordVerifyPage from "@/pages/ResetPasswordVerifyPage/ResetPasswordVerifyPage";
import SignInPage from "@/pages/SignInPage/SignInPage";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";
import HostPage from "@/pages/HostRegistrationPages/HostPage/HostPage";
import HostDashboardPage from "@/pages/HostRegistrationPages/HostDashboardPage/HostDashboardPage";

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
            <Route path="/:ln/host" element={<HostPage />}>
               <Route 
                    path="registration"
                    element={<PrivateRoute Component={HostMainInfoPage} />}
                />
                <Route
                    path="dashboard"
                    element={<PrivateRoute Component={HostDashboardPage} />}
                />
            <Route/> 
            </Route>
            
        </Routes>
    );
};
