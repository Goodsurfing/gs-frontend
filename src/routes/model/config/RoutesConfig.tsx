import { HostsLayoutPage } from "@/pages/HostsLayoutPage";
import { HostVideoPage } from "@/pages/HostVideoPage";
import { HostGalleryPage } from "@/pages/HostGalleryPage";
import { HostMainInfoPage } from "@/pages/HostMainInfoPage";
import { HostDashboardPage } from "@/pages/HostDashboardPage";
import { HostOffersPage } from "@/pages/HostOffersPage";
import { HostReviewPage } from "@/pages/HostReviewPage";

import { ConfirmEmailPage } from "@/pages/ConfirmEmailPage";
import { ConfirmEmailSuccessPage } from "@/pages/ConfirmEmailSuccessPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { SignInPage } from "@/pages/SignInPage";
import { ResetPasswordVerifyPage } from "@/pages/ResetPasswordVerifyPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";

import { OfferLayoutPage } from "@/pages/OfferLayoutPage/OfferLayoutPage";
import { OfferWelcomePage } from "@/pages/OfferWelcomePage";
import { OfferWhoNeedsPage } from "@/pages/OfferWhoNeeds";
import { OfferWhenPage } from "@/pages/OfferWhenPage";
import { OfferWherePage } from "@/pages/OfferWherePage";
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { OfferWhatToDoPage } from "@/pages/OfferWhatToDoPage";
import { OfferConditionsPage } from "@/pages/OfferConditionsPage";
import { OfferFinishingTouchesPage } from "@/pages/OfferFinishingTouches";
import { OfferPersonalPage } from "@/pages/OfferPersonalPage";

import { MainPage } from "@/pages/MainPage";
import { ProfileInfoPage } from "@/pages/ProfileInfoPage";
import { ProfilePreferencesPage } from "@/pages/ProfilePreferencesPage";
import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";

import {
    getConfirmEmailPageUrl,
    getConfirmEmailSuccessPageUrl,
    getHostGalleryPageUrl,
    getHostRegistrationUrl,
    getHostVideoPageUrl,
    getMainPageUrl,
    getOfferPersonalPageUrl,
    getOffersDescriptionPageUrl,
    getOffersPageUrl,
    getOffersWelcomePageUrl,
    getOffersWhenPageUrl,
    getOffersWherePageUrl,
    getOffersWhoNeedsPageUrl,
    getOffersWhatToDoPageUrl,
    getOffersConditionsPageUrl,
    getProfileInfoPageUrl,
    getProfilePreferencesPageUrl,
    getResetPasswordPageUrl,
    getResetPasswordVerifyPageUrl,
    getProfileResetPasswordPageUrl,
    getSignInPageUrl,
    getSignUpPageUrl,
    getHostDashboardPageUrl,
    getOffersFinishingTouchesPageUrl,
    getHostReviewPageUrl,
    getMyOffersPageUrl,
    getHostPageUrl,
    getHostTeamPageUrl,
} from "@/shared/config/routes/AppUrls";

import { RouteType } from "../types/langRouter";
import { PrivateRouteGuard } from "../guards/PrivateRouteGuard";
import { HostTeamPage } from "@/pages/HostTeamPage";

const publicRoutes: RouteType[] = [
    {
        element: (
            <MainPage />
        ),
        label: "main",
        path: (locale: string) => getMainPageUrl(locale),
    },
    {
        element: (
            <SignInPage />
        ),
        label: "sign-in",
        path: (locale: string) => getSignInPageUrl(locale),
    },
    {
        element: (
            <SignUpPage />
        ),
        label: "sign-up",
        path: (locale: string) => getSignUpPageUrl(locale),
    },
    {
        label: "confirm-email",
        element: (
            <ConfirmEmailPage />
        ),
        path: (locale: string) => getConfirmEmailPageUrl(locale),
    },
    {
        label: "confirm-email-success",
        element: (
            <ConfirmEmailSuccessPage />
        ),
        path: (locale: string) => getConfirmEmailSuccessPageUrl(locale),
    },
    {
        label: "host-layout",
        element: (
            <HostsLayoutPage />
        ),
        path: (locale: string) => getHostPageUrl(locale),
        children: [
            {
                label: "host-dashboard",
                element: (
                    <HostDashboardPage />
                ),
                index: true,
                path: (locale) => getHostDashboardPageUrl(locale),
            },
            {
                label: "host-offers",
                element: (
                    <HostOffersPage />
                ),
                path: (locale) => getMyOffersPageUrl(locale),
            },
            {
                label: "host-main-info",
                element: (
                    <HostMainInfoPage />
                ),
                path: (locale) => getHostRegistrationUrl(locale),
            },
            {
                label: "host-gallery",
                element: (
                    <HostGalleryPage />
                ),
                path: (locale) => getHostGalleryPageUrl(locale),
            },
            {
                label: "host-video",
                element: (
                    <HostVideoPage />
                ),
                path: (locale) => getHostVideoPageUrl(locale),
            },
            {
                label: "host-team",
                element: (
                    <HostTeamPage />
                ),
                path: (locale) => getHostTeamPageUrl(locale),
            }, {
                label: "host-review",
                element: (
                    <HostReviewPage />
                ),
                path: (locale: string) => getHostReviewPageUrl(locale),
            },
        ],
    },
    {
        label: "offer-layout",
        element: (
            <OfferLayoutPage />
        ),
        path: (locale: string) => getOffersPageUrl(locale),
        children: [
            {
                label: "offer-welcome",
                element: (
                    <OfferWelcomePage />
                ),
                path: (locale: string) => getOffersWelcomePageUrl(locale),
            },
            {
                label: "offer-description",
                element: (
                    <OfferDescriptionPage />
                ),
                path: (locale: string) => getOffersDescriptionPageUrl(locale),
            },
            {
                label: "offer-when",
                element: (
                    <OfferWhenPage />
                ),
                path: (locale: string) => getOffersWhenPageUrl(locale),
            },
            {
                label: "offer-where",
                element: (
                    <OfferWherePage />
                ),
                path: (locale: string) => getOffersWherePageUrl(locale),
            },
            {
                label: "offer-who-needs",
                element: (
                    <OfferWhoNeedsPage />
                ),
                path: (locale: string) => getOffersWhoNeedsPageUrl(locale),
            },
            {
                label: "offer-what-to-do",
                element: (
                    <OfferWhatToDoPage />
                ),
                path: (locale: string) => getOffersWhatToDoPageUrl(locale),
            },
            {
                label: "offer-conditions",
                element: (
                    <OfferConditionsPage />
                ),
                path: (locale: string) => getOffersConditionsPageUrl(locale),
            },
            {
                label: "offer-finishing-touches",
                element: (
                    <OfferFinishingTouchesPage />
                ),
                path: (locale: string) => getOffersFinishingTouchesPageUrl(locale),
            },
        ],
    },
    {
        label: "offer-personal",
        element: (
            <OfferPersonalPage />
        ),
        path: (locale: string) => getOfferPersonalPageUrl(locale),
    },
    {
        label: "reset-password",
        element: (
            <ResetPasswordPage />
        ),
        path: (locale: string) => getResetPasswordPageUrl(locale),
    },
    {
        label: "reset-password-profile",
        element: (
            <ProfileResetPasswordPage />
        ),
        path: (locale: string) => getProfileResetPasswordPageUrl(locale),
    },
    {
        label: "reset-password-verify",
        element: (
            <ResetPasswordVerifyPage />
        ),
        path: (locale: string) => getResetPasswordVerifyPageUrl(locale),
    },
    {
        label: "profile-info",
        element: (
            <PrivateRouteGuard>
                <ProfileInfoPage />
            </PrivateRouteGuard>
        ),
        path: (locale: string) => getProfileInfoPageUrl(locale),
    },
    {
        label: "profile-preferences",
        element: (
            <ProfilePreferencesPage />
        ),
        path: (locale: string) => getProfilePreferencesPageUrl(locale),
    },
];

// todo: make private routes
export const allRoutes = [...publicRoutes];
