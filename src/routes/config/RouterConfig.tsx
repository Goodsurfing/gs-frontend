import React from "react";

import { RouteProps } from "react-router-dom";
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
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { MainPage } from "@/pages/MainPage";
import { ProfileInfoPage } from "@/pages/ProfileInfoPage";
import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import { OfferWherePage } from "@/pages/OfferWherePage";

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    element: JSX.Element;
};

export enum AppRoutes {
    MAIN = "main",
    SIGN_UP = "sign_up",
    SIGN_IN = "sing_in",
    RESET_PASSWORD = "reset_password",
    RESET_PASSWORD_VERIFY = "reset_password_verify",
    CONFIRM_EMAIL = "confirm_email",
    CONFIRM_EMAIL_SUCCESS = "confirm_email_success",
    PROFILE_INFO = "profile_info",
    PROFILE_RESET_PASSWORD = "profile_reset_password",
    HOST = "host",
    HOST_REGISTRATION = "offers_registration",
    HOST_GALLERY = "host_gallery",
    HOST_VIDEO = "host_video",
    OFFERS = "offers",
    OFFERS_WELCOME = "offers_welcome",
    OFFERS_WHERE = "offers_where",
    OFFERS_WHEN = "offers_when",
    OFFERS_WHO_NEEDS = "offers_who_needs",
    OFFERS_DESCRIPTION = "offers_description",
    NOT_FOUND = "not_found",
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: "/:ln",
    [AppRoutes.CONFIRM_EMAIL]: "/:ln/signup",
    [AppRoutes.CONFIRM_EMAIL_SUCCESS]: "/:ln/singin",
    [AppRoutes.RESET_PASSWORD]: "/:ln/reset-password",
    [AppRoutes.RESET_PASSWORD_VERIFY]: ":/ln/reset-password-verify",
    [AppRoutes.PROFILE_INFO]: "/:ln/profile/info",
    [AppRoutes.PROFILE_RESET_PASSWORD]: "/:ln/profile/reset-password",
    [AppRoutes.HOST]: "/:ln/host",
    [AppRoutes.HOST_REGISTRATION]: "/:ln/offers/registration",
    [AppRoutes.HOST_GALLERY]: "/:ln/gallery",
    [AppRoutes.HOST_VIDEO]: "/:ln/video",
    [AppRoutes.OFFERS]: "/:ln/offers",
    [AppRoutes.OFFERS_WELCOME]: "/:ln/offers-welcome",
    [AppRoutes.OFFERS_WHERE]: "/:ln/offers-where",
    [AppRoutes.OFFERS_WHEN]: "/:ln/offers-when",
    [AppRoutes.OFFERS_WHO_NEEDS]: "/:ln/offers-who-needs",
    [AppRoutes.OFFERS_DESCRIPTION]: "/:ln/offers-description",
    [AppRoutes.SIGN_UP]: "/:ln/signup",
    [AppRoutes.SIGN_IN]: "/:ln/signin",
    [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <MainPage />,
    },
    [AppRoutes.SIGN_UP]: {
        path: RoutePath.sing_in,
        element: <SignInPage />,
    },
    [AppRoutes.SIGN_IN]: {
        path: RoutePath.sign_up,
        element: <SignUpPage />,
    },
    [AppRoutes.RESET_PASSWORD]: {
        path: RoutePath.reset_password,
        element: <ResetPasswordPage />,
    },
    [AppRoutes.RESET_PASSWORD_VERIFY]: {
        path: RoutePath.reset_password_verify,
        element: <ResetPasswordVerifyPage />,
    },
    [AppRoutes.CONFIRM_EMAIL]: {
        path: RoutePath.confirm_email,
        element: <ConfirmEmailPage />,
    },
    [AppRoutes.CONFIRM_EMAIL_SUCCESS]: {
        path: RoutePath.confirm_email_success,
        element: <ConfirmEmailSuccessPage />,
    },
    [AppRoutes.PROFILE_INFO]: {
        path: RoutePath.profile_info,
        element: <ProfileInfoPage />,
    },
    [AppRoutes.PROFILE_RESET_PASSWORD]: {
        path: RoutePath.reset_password,
        element: <ProfileResetPasswordPage />,
    },
    [AppRoutes.HOST]: {
        path: RoutePath.host,
        element: <HostDashboardPage />,
    },
    [AppRoutes.HOST_REGISTRATION]: {
        path: RoutePath.offers_registration,
        element: <HostMainInfoPage />,
    },
    [AppRoutes.HOST_GALLERY]: {
        path: RoutePath.host_gallery,
        element: <HostGalleryPage />,
    },
    [AppRoutes.HOST_VIDEO]: {
        path: RoutePath.host_video,
        element: <HostVideoPage />,
    },
    [AppRoutes.OFFERS]: {
        path: RoutePath.offers,
        element: <HostOffersPage />,
    },
    [AppRoutes.OFFERS_WELCOME]: {
        path: RoutePath.offers_welcome,
        element: <OfferWelcomePage />,
    },
    [AppRoutes.OFFERS_WHERE]: {
        path: RoutePath.offers_where,
        element: <OfferWherePage />,
    },
    [AppRoutes.OFFERS_WHEN]: {
        path: RoutePath.offers_when,
        element: <OfferWhenPage />,
    },
    [AppRoutes.OFFERS_WHO_NEEDS]: {
        path: RoutePath.offers_who_needs,
        element: <OfferWhoNeedsPage />,
    },
    [AppRoutes.OFFERS_DESCRIPTION]: {
        path: RoutePath.offers_description,
        element: <OfferDescriptionPage />,
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
    },
};
