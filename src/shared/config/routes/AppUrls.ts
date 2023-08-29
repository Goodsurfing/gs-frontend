import { RoutePath } from "./RouterConfig";

type RoutePathFunction = (locale: string) => string;

// Main page

export const getMainPageUrl: RoutePathFunction = (locale) => (`/${locale}${RoutePath.main}`);

// Auth bounded pages

export const getConfirmEmailPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.confirm_email}`;

export const getConfirmEmailSuccessPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.confirm_email_success}`;

export const getResetPasswordPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.reset_password}`;

export const getResetPasswordVerifyPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.reset_password_verify}`;

export const getSignInPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.sign_in}`;

export const getSignUpPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.sign_up}`;

export const getProfileResetPasswordPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_reset_password}`;

// About me pages

export const getProfileInfoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_info}`;

// Host pages

export const getHostPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host}`;

export const getHostDashboardPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.dashboard}`;

export const getMyOffersPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.my_offers}`;

// Host / organization pages

export const getHostRegistrationUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_registration}`;

export const getHostGalleryPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_gallery}`;

export const getHostVideoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_video}`;

// Offers pages

export const getOffersPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers}`;

export const getOffersWelcomePageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_welcome}`;

export const getOffersWhenPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_when}`;

export const getOffersWherePageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_where}`;

export const getOffersWhoNeedsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_who_needs}`;

export const getOffersDescriptionPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_description}`;

export const getOffersWhatToDoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_what_to_do}`;

export const getOffersConditionsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_conditions}`;

export const getOffersFinishingTouchesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_finishing_touches}`;

export const getOfferPersonalPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offer_personal}/:id`;
