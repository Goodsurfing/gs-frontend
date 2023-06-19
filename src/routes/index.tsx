import PrivateRoute from "@/hoc/PrivateRoute/PrivateRoute";
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Preloader from "@/components/Preloader/Preloader";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

import { HostGalleryPage } from "@/pages/HostGalleryPage"; 

import { HostVideoPage } from "@/pages/HostVideoPage";

const OfferCreatePages = lazy(
    () => import("@/pages/OfferCreatePages/OfferCreatePages")
);

const ConfirmEmailPage = lazy(
    () => import("@/pages/ConfirmEmailPage/ConfirmEmailPage")
);
const ConfirmEmailSuccessPage = lazy(
    () => import("@/pages/ConfirmEmailSuccessPage/ConfirmEmailSuccessPage")
);
const HostPage = lazy(() => import("@/pages/HostPages/HostPages"));
const MainPage = lazy(() => import("@/pages/MainPage/MainPage"));
const ProfilePage = lazy(
    () => import("@/pages/ProfilePages/ProfilePage/ProfilePage")
);
const ResetPasswordPage = lazy(
    () => import("@/pages/ResetPasswordPage/ResetPasswordPage")
);
const ResetPasswordVerifyPage = lazy(
    () => import("@/pages/ResetPasswordVerifyPage/ResetPasswordVerifyPage")
);
const SignInPage = lazy(() => import("@/pages/SignInPage/SignInPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage/SignUpPage"));

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
