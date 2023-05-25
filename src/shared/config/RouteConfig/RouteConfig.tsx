import { RouteProps } from "react-router-dom";

import { MainPage } from "pages/MainPage";
import { SignInPage } from "pages/SignInPage";
import { SignUpPage } from "pages/SignUpPage";
import { ResetPasswordPage } from "pages/ResetPasswordPage";
import { ResetPasswordVerifyPage } from "pages/ResetPasswordVerifyPage";
import { ConfirmEmailPage } from "pages/ConfirmEmailPage";
import { ConfirmEmailSuccessPage } from "pages/ConfirmEmailSuccessPage";
import { ProfileInfoPage } from "pages/ProfileInfoPage";
import { HostPage } from "pages/HostDashboardPage";
import { HostOffersPage } from "pages/HostOffersPage";
import { OfferWelcome } from "pages/OfferWelcomePage";
import { OfferWherePage } from "pages/OfferWherePage";
import { OfferWhenPage } from "pages/OfferWhenPage";
import { OfferWhoNeedsPage } from "pages/OfferWhoNeedsPage";
import { OfferDescriptionPage } from "pages/OfferDescriptionPage";
import { NotFoundPage } from "pages/NotFoundPage";

export enum AppRoutes {
  MAIN = "main",
  SIGN_UP = "signup",
  SIGN_IN = "signin",
  RESET_PASSWORD = "reset_password",
  RESET_PASSWORD_VERIFY = "reset_password_verify",
  CONFIRM_EMAIL = "сonfirm_email",
  CONFIRM_SUCCESS = "confirm_email_success",
  PROFILE = "profile",
  HOST = "host",
  ORGANIZATION_REGISTRATION = "organization_registration",
  OFFERS = "offers",
  OFFERS_WELCOME = "offers_welcome",
  OFFERS_WHERE = "offers_where",
  OFFERS_WHEN = "offers_when",
  OFFERS_WHO_NEEDS = "offers_who_needs",
  OFFERS_DESCRIPTION = "offers_description",
  NOT_FOUND = "not_found",
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: ":ln/",
  [AppRoutes.SIGN_UP]: ":ln/signup",
  [AppRoutes.SIGN_IN]: ":ln/signin",
  [AppRoutes.RESET_PASSWORD]: ":ln/reset-password",
  [AppRoutes.RESET_PASSWORD_VERIFY]: ":ln/reset-password-verify",
  [AppRoutes.CONFIRM_EMAIL]: ":ln/confirm-email",
  [AppRoutes.CONFIRM_SUCCESS]: ":ln/confirm-email-success",
  [AppRoutes.PROFILE]: ":ln/profile",
  [AppRoutes.HOST]: ":ln/host",
  [AppRoutes.ORGANIZATION_REGISTRATION]: ":ln/organization-registration",
  [AppRoutes.OFFERS]: ":ln/offers",
  [AppRoutes.OFFERS_WELCOME]: ":ln/offers-welcome",
  [AppRoutes.OFFERS_WHERE]: ":ln/offers-where",
  [AppRoutes.OFFERS_WHEN]: ":ln/offers-when",
  [AppRoutes.OFFERS_WHO_NEEDS]: ":ln/offers-who-needs",
  [AppRoutes.OFFERS_DESCRIPTION]: ":ln/offers-description",
  [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
  },
  [AppRoutes.SIGN_UP]: {
    path: RoutePath.signup,
    element: <SignUpPage />,
  },
  [AppRoutes.SIGN_IN]: {
    path: RoutePath.signin,
    element: <SignInPage />,
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
    path: RoutePath.сonfirm_email,
    element: <ConfirmEmailPage />,
  },
  [AppRoutes.CONFIRM_SUCCESS]: {
    path: RoutePath.confirm_email_success,
    element: <ConfirmEmailSuccessPage />,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePath.profile,
    element: <ProfileInfoPage />,
  },
  [AppRoutes.HOST]: {
    // path: <HostPage />,
    // element: ,
  },
  [AppRoutes.ORGANIZATION_REGISTRATION]: {
    path: RoutePath.organization_registration,
    element: <HostPage />,
  },
  [AppRoutes.OFFERS]: {
    path: RoutePath.offers,
    element: <HostOffersPage />,
  },
  [AppRoutes.OFFERS_WELCOME]: {
    path: RoutePath.offers_welcome,
    element: <OfferWelcome />,
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
