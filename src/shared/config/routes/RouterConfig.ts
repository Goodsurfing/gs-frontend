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
    HOST_DASHBOARD = "dashboard",
    HOST_REGISTRATION = "offers_registration",
    HOST_GALLERY = "host_gallery",
    HOST_REVIEW = "host_review",
    HOST_VIDEO = "host_video",
    OFFERS = "offers",
    MY_OFFERS = "my_offers",
    OFFERS_WELCOME = "offers_welcome",
    OFFERS_WHERE = "offers_where",
    OFFERS_WHEN = "offers_when",
    OFFERS_WHO_NEEDS = "offers_who_needs",
    OFFERS_DESCRIPTION = "offers_description",
    OFFERS_WHAT_TO_DO = "offers_what_to_do",
    OFFERS_CONDITIONS = "offers_conditions",
    OFFER_FINISHING_TOUCHES = "offers_finishing_touches",
    NOT_FOUND = "not_found",
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: "/",
    [AppRoutes.CONFIRM_EMAIL]: "/confirm-email",
    [AppRoutes.CONFIRM_EMAIL_SUCCESS]: "/confirm-email-success",
    [AppRoutes.RESET_PASSWORD]: "/reset-password",
    [AppRoutes.RESET_PASSWORD_VERIFY]: "/reset-password-verify",
    [AppRoutes.PROFILE_INFO]: "/profile",
    [AppRoutes.PROFILE_RESET_PASSWORD]: "/profile/reset-password",
    [AppRoutes.HOST]: "/host",
    [AppRoutes.HOST_DASHBOARD]: "/host-dashboard",
    [AppRoutes.HOST_REGISTRATION]: "/host/registration",
    [AppRoutes.HOST_GALLERY]: "/host/gallery",
    [AppRoutes.HOST_REVIEW]: "/host/review",
    [AppRoutes.HOST_VIDEO]: "/host/video",
    [AppRoutes.MY_OFFERS]: "/my-offers",
    [AppRoutes.OFFERS]: "/offers",
    [AppRoutes.OFFERS_WELCOME]: "/offers/welcome",
    [AppRoutes.OFFERS_WHERE]: "/offers/where",
    [AppRoutes.OFFERS_WHEN]: "/offers/when",
    [AppRoutes.OFFERS_WHO_NEEDS]: "/offers/who-needs",
    [AppRoutes.OFFERS_DESCRIPTION]: "/offers/description",
    [AppRoutes.OFFERS_WHAT_TO_DO]: "/offers/what-to-do",
    [AppRoutes.OFFERS_CONDITIONS]: "/offers/conditions",
    [AppRoutes.OFFER_FINISHING_TOUCHES]: "/offers/finishing-touches",
    [AppRoutes.SIGN_UP]: "/signup",
    [AppRoutes.SIGN_IN]: "/signin",
    [AppRoutes.NOT_FOUND]: "*",
};
