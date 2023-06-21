import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "@/hoc/PrivateRoute/PrivateRoute";

import Preloader from "@/components/Preloader/Preloader";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

import { HostGalleryPage } from "@/pages/HostGalleryPage";
import { HostVideoPage } from "@/pages/HostVideoPage";

import { HostMainInfoPage } from "@/pages/HostMainInfoPage";
import { HostDashboardPage } from "@/pages/HostDashboardPage";
import { HostOffersPage } from "@/pages/HostOffersPage";

const OfferCreatePages = lazy(
    () => { return import("@/pages/OfferCreatePages/OfferCreatePages"); },
);

const ConfirmEmailPage = lazy(
    () => { return import("@/pages/ConfirmEmailPage/ConfirmEmailPage"); },
);
const ConfirmEmailSuccessPage = lazy(
    () => { return import("@/pages/ConfirmEmailSuccessPage/ConfirmEmailSuccessPage"); },
);
const HostPage = lazy(() => { return import("@/pages/HostPages/HostPages"); });
const MainPage = lazy(() => { return import("@/pages/MainPage/MainPage"); });
const ProfilePage = lazy(
    () => { return import("@/pages/ProfilePage/ProfilePage"); },
);
const ResetPasswordPage = lazy(
    () => { return import("@/pages/ResetPasswordPage/ResetPasswordPage"); },
);
const ResetPasswordVerifyPage = lazy(
    () => { return import("@/pages/ResetPasswordVerifyPage/ui/ResetPasswordVerifyPage"); },
);
const SignInPage = lazy(() => { return import("@/pages/SignInPage/SignInPage"); });
const SignUpPage = lazy(() => { return import("@/pages/SignUpPage/SignUpPage"); });

export const AppRoutes = () => {
    return (
        <Suspense fallback={<Preloader />}>
            <Routes>
                <Route path="/:ln" element={<MainPage />} />
                {/* Auth */}
                <Route path="/:ln/signup" element={<SignUpPage />} />
                <Route path="/:ln/signin" element={<SignInPage />} />
                <Route
                    path="/:ln/reset-password"
                    element={<ResetPasswordPage />}
                />
                <Route
                    path="/:ln/reset-password-verify"
                    element={<ResetPasswordVerifyPage />}
                />
                <Route
                    path="/:ln/confirm-email"
                    element={<ConfirmEmailPage />}
                />
                <Route
                    path="/:ln/confirm-email-success"
                    element={<ConfirmEmailSuccessPage />}
                />
                {/* Profile */}
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
                {/* Host */}
                <Route
                    path="/:ln/host"
                    element={<PrivateRoute Component={HostPage} />}
                />
                <Route
                    path="/:ln/organization/registration"
                    element={<PrivateRoute Component={HostPage} />}
                />
                <Route
                    path="/:ln/organization/gallery"
                    element={<HostGalleryPage />}
                />
                <Route
                    path="/:ln/organization/video"
                    element={<HostVideoPage />}
                />
                {/* Offers pages */}
                <Route
                    path="/:ln/offers"
                    element={<PrivateRoute Component={HostPage} />}
                />
                <Route
                    path="/:ln/offers-welcome"
                    element={<PrivateRoute Component={OfferCreatePages} />}
                />
                <Route
                    path="/:ln/offers-where"
                    element={<PrivateRoute Component={OfferCreatePages} />}
                />
                <Route
                    path="/:ln/offers-when"
                    element={<PrivateRoute Component={OfferCreatePages} />}
                />
                <Route
                    path="/:ln/offers-who-needs"
                    element={<PrivateRoute Component={OfferCreatePages} />}
                />
                <Route
                    path="/:ln/offers-description"
                    element={<PrivateRoute Component={OfferCreatePages} />}
                />
                {/* Preloader */}
                <Route path="/:ln/preloader" element={<Preloader />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};
