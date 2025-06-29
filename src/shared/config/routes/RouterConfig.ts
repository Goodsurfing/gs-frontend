import { RouteProps } from "react-router-dom";

import { AppRoutes } from "./AppRoutes";

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    element: JSX.Element;
};

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: "/",
    [AppRoutes.OFFERS_MAP]: "/offers-map",
    [AppRoutes.MESSENGER]: "/messenger", // :id
    [AppRoutes.CATEGORIES]: "/categories",
    [AppRoutes.FAVORITE_OFFERS]: "/favorite-offers",
    [AppRoutes.CONFIRM_EMAIL]: "/confirm-email",
    [AppRoutes.CONFIRM_EMAIL_SUCCESS]: "/confirm-email-success",
    [AppRoutes.EMAIL_EXPIRED]: "/email-expired",
    [AppRoutes.CONFIRM_ERROR]: "/confirm-error",
    [AppRoutes.EMAIL_ALREADY_CONFIRMED]: "/email-already-confirmed",
    [AppRoutes.RESET_PASSWORD]: "/reset-password",
    [AppRoutes.RESET_PASSWORD_VERIFY]: "/reset-password-verify",
    [AppRoutes.PROFILE]: "/profile",
    [AppRoutes.PROFILE_INFO]: "/profile/info",
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
    [AppRoutes.OFFERS]: "/offers", // :id
    [AppRoutes.OFFERS_WELCOME]: "/offers/welcome", // :id
    [AppRoutes.OFFERS_WHERE]: "/offers/where", // :id
    [AppRoutes.OFFERS_WHEN]: "/offers/when", // :id
    [AppRoutes.OFFERS_WHO_NEEDS]: "/offers/who-needs", // :id
    [AppRoutes.OFFERS_DESCRIPTION]: "/offers/description", // :id
    [AppRoutes.OFFERS_WHAT_TO_DO]: "/offers/what-to-do", // :id
    [AppRoutes.OFFERS_CONDITIONS]: "/offers/conditions", // :id
    [AppRoutes.OFFER_FINISHING_TOUCHES]: "/offers/finishing-touches", // :id
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
    [AppRoutes.ABOUT_PROJECT]: "/about-project",
    [AppRoutes.FIND_JOB]: "/find-job",
    [AppRoutes.BECOME_HOST]: "/become-host",
    [AppRoutes.BLOG]: "/blog",
    [AppRoutes.NEWS]: "/news",
    [AppRoutes.JOURNALS]: "/journals",
    [AppRoutes.VIDEO]: "/video",
    [AppRoutes.PRIVACY_POLICY]: "/privacy-policy",
    [AppRoutes.OUR_TEAM]: "/our-team",
    [AppRoutes.AMBASSADORS]: "/ambassadors",
    [AppRoutes.ACADEMY_MAIN]: "/academy-main",
    [AppRoutes.ACADEMY_COURSE]: "/academy-course",
    [AppRoutes.ACADEMY_LESSON]: "/academy-lesson",
    [AppRoutes.SIGN_UP]: "/signup",
    [AppRoutes.SIGN_IN]: "/signin",
    [AppRoutes.NOT_FOUND]: "*",
};
