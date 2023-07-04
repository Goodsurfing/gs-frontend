import { HostVideoPage } from "@/pages/HostVideoPage";
import { HostGalleryPage } from "@/pages/HostGalleryPage";
import { HostMainInfoPage } from "@/pages/HostMainInfoPage";
import { HostDashboardPage } from "@/pages/HostDashboardPage";
import { HostOffersPage } from "@/pages/HostOffersPage";
import { ConfirmEmailPage } from "@/pages/ConfirmEmailPage";
import { ConfirmEmailSuccessPage } from "@/pages/ConfirmEmailSuccessPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { SignInPage } from "@/pages/SignInPage";
import { ResetPasswordVerifyPage } from "@/pages/ResetPasswordVerifyPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { OfferWelcomePage } from "@/pages/OfferWelcomePage";
import { OfferWhoNeedsPage } from "@/pages/OfferWhoNeeds";
import { OfferWhenPage } from "@/pages/OfferWhenPage";
import { OfferWherePage } from "@/pages/OfferWherePage";
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { MainPage } from "@/pages/MainPage";
import { ProfileInfoPage } from "@/pages/ProfileInfoPage";
import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";

import {
    getConfirmEmailPageUrl,
    getConfirmEmailSuccessPageUrl,
    getHostGalleryPageUrl,
    getHostPageUrl,
    getHostRegistrationUrl,
    getHostVideoPageUrl,
    getMainPageUrl,
    getOffersDescriptionPageUrl,
    getOffersPageUrl,
    getOffersWelcomePageUrl,
    getOffersWhenPageUrl,
    getOffersWherePageUrl,
    getOffersWhoNeedsPageUrl,
    getProfileInfoPageUrl,
    getResetPasswordPageUrl,
    getResetPasswordVerifyPageUrl,
    getProfileResetPasswordPageUrl,
    getSignInPageUrl,
    getSignUpPageUrl,
} from "../services/AppUrls/AppUrls";

import { RouteWithChildrenProps } from "../types/langRouter";

const publicRoutes: RouteWithChildrenProps[] = [
    {
        element: (
            <MainPage />
        ),
        path: (locale: string) => getMainPageUrl(locale),
    },
    {
        element: (
            <SignInPage />
        ),
        path: (locale: string) => getSignInPageUrl(locale),
    },
    {
        element: (
            <SignUpPage />
        ),
        path: (locale: string) => getSignUpPageUrl(locale),
    },
    {
        element: (
            <ConfirmEmailPage />
        ),
        path: (locale: string) => getConfirmEmailPageUrl(locale),
    },
    {
        element: (
            <ConfirmEmailSuccessPage />
        ),
        path: (locale: string) => getConfirmEmailSuccessPageUrl(locale),
    },
    {
        element: (
            <HostDashboardPage />
        ),
        path: (locale: string) => getHostPageUrl(locale),
    },
    {
        element: (
            <HostGalleryPage />
        ),
        path: (locale: string) => getHostGalleryPageUrl(locale),
    },
    {
        element: (
            <HostMainInfoPage />
        ),
        path: (locale: string) => getHostRegistrationUrl(locale),
    },
    {
        element: (
            <HostOffersPage />
        ),
        path: (locale: string) => getOffersPageUrl(locale),
    },
    {
        element: (
            <OfferWelcomePage />
        ),
        path: (locale: string) => getOffersWelcomePageUrl(locale),
    },
    {
        element: (
            <OfferDescriptionPage />
        ),
        path: (locale: string) => getOffersDescriptionPageUrl(locale),
    },
    {
        element: (
            <OfferWhenPage />
        ),
        path: (locale: string) => getOffersWhenPageUrl(locale),
    },
    {
        element: (
            <OfferWherePage />
        ),
        path: (locale: string) => getOffersWherePageUrl(locale),
    },
    {
        element: (
            <OfferWhoNeedsPage />
        ),
        path: (locale: string) => getOffersWhoNeedsPageUrl(locale),
    },
    {
        element: (
            <MainPage />
        ),
        path: (locale: string) => getMainPageUrl(locale),
    },
    {
        element: (
            <ResetPasswordPage />
        ),
        path: (locale: string) => getResetPasswordPageUrl(locale),
    },
    {
        element: (
            <ProfileResetPasswordPage />
        ),
        path: (locale: string) => getProfileResetPasswordPageUrl(locale),
    },
    {
        element: (
            <ResetPasswordVerifyPage />
        ),
        path: (locale: string) => getResetPasswordVerifyPageUrl(locale),
    },
    {
        element: (
            <HostVideoPage />
        ),
        path: (locale: string) => getHostVideoPageUrl(locale),
    },
    {
        element: (
            <ProfileInfoPage />
        ),
        path: (locale: string) => getProfileInfoPageUrl(locale),
    },
];

// todo: make private routes
export const allRoutes = [...publicRoutes];
