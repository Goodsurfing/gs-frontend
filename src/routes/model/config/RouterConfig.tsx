import { RouteProps } from "react-router-dom";

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
    [AppRoutes.MAIN]: "/",
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
