import { RouteProps } from "react-router-dom";

import { AppRoutes } from "./AppRoutes";

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    element: JSX.Element;
};

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: "/",
    [AppRoutes.CATEGORIES]: "/categories",
    [AppRoutes.CONFIRM_EMAIL]: "/confirm-email",
    [AppRoutes.CONFIRM_EMAIL_SUCCESS]: "/confirm-email-success",
    [AppRoutes.RESET_PASSWORD]: "/reset-password",
    [AppRoutes.RESET_PASSWORD_VERIFY]: "/reset-password-verify",
    [AppRoutes.PROFILE_INFO]: "/profile",
    [AppRoutes.PROFILE_PREFERENCES]: "/profile/preferences",
    [AppRoutes.PROFILE_ROLE]: "/profile/role",
    [AppRoutes.PROFILE_RESET_PASSWORD]: "/profile/reset-password",
    [AppRoutes.PROFILE_PRIVACY]: "/profile/privacy",
    [AppRoutes.HOST]: "/host",
    [AppRoutes.OFFER_PERSONAL]: "/offer-personal", // :id
    [AppRoutes.HOST_PERSONAL]: "/host-personal", // :id
    [AppRoutes.HOST_DASHBOARD]: "/host/host-dashboard",
    [AppRoutes.HOST_REGISTRATION]: "/host/registration",
    [AppRoutes.HOST_GALLERY]: "/host/gallery",
    [AppRoutes.HOST_REVIEW]: "/host/review",
    [AppRoutes.HOST_NOTES]: "/host/notes",
    [AppRoutes.HOST_VIDEO]: "/host/video",
    [AppRoutes.HOST_TEAM]: "/host/team",
    [AppRoutes.MY_OFFERS]: "/host/my-offers",
    [AppRoutes.OFFERS]: "/offers",
    [AppRoutes.OFFERS_WELCOME]: "/offers/welcome",
    [AppRoutes.OFFERS_WHERE]: "/offers/where",
    [AppRoutes.OFFERS_WHEN]: "/offers/when",
    [AppRoutes.OFFERS_WHO_NEEDS]: "/offers/who-needs",
    [AppRoutes.OFFERS_DESCRIPTION]: "/offers/description",
    [AppRoutes.OFFERS_WHAT_TO_DO]: "/offers/what-to-do",
    [AppRoutes.OFFERS_CONDITIONS]: "/offers/conditions",
    [AppRoutes.OFFER_FINISHING_TOUCHES]: "/offers/finishing-touches",
    [AppRoutes.VOLUNTEER]: "/volunteer",
    [AppRoutes.VOLUNTEER_DASHBOARD]: "/volunteer/volunteer-dashboard",
    [AppRoutes.VOLUNTEER_SKILLS]: "/volunteer/skills",
    [AppRoutes.VOLUNTEER_REVIEW]: "/volunteer/review",
    [AppRoutes.VOLUNTEER_NOTES]: "/volunteer/notes",
    [AppRoutes.VOLUNTEER_SUBSCRIBERS]: "/volunteer/subscribers",
    [AppRoutes.VOLUNTEER_GALLERY]: "/volunteer/gallery",
    [AppRoutes.VOLUNTEER_CREATE_ARTICLE]: "/volunteer/create-article",
    [AppRoutes.VOLUNTEER_ARTICLES]: "/volunteer/articles",
    [AppRoutes.VOLUNTEER_PERSONAL]: "/volunteer-personal", // :id
    [AppRoutes.MEMBERSHIP]: "/membership",
    [AppRoutes.NPO]: "/npo",
    [AppRoutes.RULES]: "/rules",
    [AppRoutes.PRIVACY_POLICY]: "/privacy-policy",
    [AppRoutes.SIGN_UP]: "/signup",
    [AppRoutes.SIGN_IN]: "/signin",
    [AppRoutes.ABOUT_PROJECT]: "/about-project",
    [AppRoutes.NOT_FOUND]: "*",
};
