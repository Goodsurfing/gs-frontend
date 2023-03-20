import PrivateRoute from "@/hoc/PrivateRoute/PrivateRoute";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const ConfirmEmailPage = lazy(() => import("@/pages/ConfirmEmailPage/ConfirmEmailPage"));
const ConfirmEmailSuccessPage = lazy(() => import("@/pages/ConfirmEmailSuccessPage/ConfirmEmailSuccessPage"));
const HostDashboardPage = lazy(() => import("@/pages/HostRegistrationPages/HostDashboardPage/HostDashboardPage"));
const HostMainInfoPage = lazy(() => import("@/pages/HostRegistrationPages/HostMainInfoPage/HostMainInfoPage"));
const HostPage = lazy(() => import("@/pages/HostRegistrationPages/HostPage/HostPage"))
const MainPage = lazy(() => import("@/pages/MainPage/MainPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePages/ProfilePage/ProfilePage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage/ResetPasswordPage"));
const ResetPasswordVerifyPage = lazy(() => import("@/pages/ResetPasswordVerifyPage/ResetPasswordVerifyPage"));
const SignInPage = lazy(() => import("@/pages/SignInPage/SignInPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage/SignUpPage"));

export const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
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
                </Route>
                <Route path="*" element={<NotFoundPage/>} />
                </Routes>
        </Suspense>
    );
};
