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
import { OfferWherePage } from "@/pages/OfferWherePage";
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { MainPage } from "@/pages/MainPage";
import { ProfileInfoPage } from "@/pages/ProfileInfoPage";
import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    element: JSX.Element;
};

export enum AppRoutes {
    MAIN = "main",
    SIGN_UP = "sign_up",
    SIGN_IN = "sign_in",
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
    [AppRoutes.MAIN]: "/main",
    [AppRoutes.CONFIRM_EMAIL]: "/confirm-email",
    [AppRoutes.CONFIRM_EMAIL_SUCCESS]: "/confirm-email-success",
    [AppRoutes.RESET_PASSWORD]: "/reset-password",
    [AppRoutes.RESET_PASSWORD_VERIFY]: "/reset-password-verify",
    [AppRoutes.PROFILE_INFO]: "/profile/info",
    [AppRoutes.PROFILE_RESET_PASSWORD]: "/profile/reset-password",
    [AppRoutes.HOST]: "/host",
    [AppRoutes.HOST_REGISTRATION]: "/host/registration",
    [AppRoutes.HOST_GALLERY]: "/host/gallery",
    [AppRoutes.HOST_VIDEO]: "/host/video",
    [AppRoutes.OFFERS]: "/offers",
    [AppRoutes.OFFERS_WELCOME]: "/offers-welcome",
    [AppRoutes.OFFERS_WHERE]: "/offers-where",
    [AppRoutes.OFFERS_WHEN]: "/offers-when",
    [AppRoutes.OFFERS_WHO_NEEDS]: "/offers-who-needs",
    [AppRoutes.OFFERS_DESCRIPTION]: "/offers-description",
    [AppRoutes.SIGN_UP]: "/signup",
    [AppRoutes.SIGN_IN]: "/signin",
    [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <MainPage />,
    },
    [AppRoutes.SIGN_UP]: {
        path: RoutePath.sign_in,
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
        authOnly: true,
    },
    [AppRoutes.PROFILE_RESET_PASSWORD]: {
        path: RoutePath.reset_password,
        element: <ProfileResetPasswordPage />,
    },
    [AppRoutes.HOST]: {
        path: RoutePath.host,
        element: <HostDashboardPage />,
        authOnly: true,
    },
    [AppRoutes.HOST_REGISTRATION]: {
        path: RoutePath.offers_registration,
        element: <HostMainInfoPage />,
        authOnly: true,
    },
    [AppRoutes.HOST_GALLERY]: {
        path: RoutePath.host_gallery,
        element: <HostGalleryPage />,
        authOnly: true,
    },
    [AppRoutes.HOST_VIDEO]: {
        path: RoutePath.host_video,
        element: <HostVideoPage />,
        authOnly: true,
    },
    [AppRoutes.OFFERS]: {
        path: RoutePath.offers,
        element: <HostOffersPage />,
        authOnly: true,
    },
    [AppRoutes.OFFERS_WELCOME]: {
        path: RoutePath.offers_welcome,
        element: <OfferWelcomePage />,
        authOnly: true,
    },
    [AppRoutes.OFFERS_WHERE]: {
        path: RoutePath.offers_where,
        element: <OfferWherePage />,
        authOnly: true,
    },
    [AppRoutes.OFFERS_WHEN]: {
        path: RoutePath.offers_when,
        element: <OfferWhenPage />,
        authOnly: true,
    },
    [AppRoutes.OFFERS_WHO_NEEDS]: {
        path: RoutePath.offers_who_needs,
        element: <OfferWhoNeedsPage />,
        authOnly: true,
    },
    [AppRoutes.OFFERS_DESCRIPTION]: {
        path: RoutePath.offers_description,
        element: <OfferDescriptionPage />,
        authOnly: true,
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
    },
};
