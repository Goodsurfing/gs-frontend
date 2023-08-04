import { RoutePath } from "./RouterConfig";

type RoutePathFunction = (locale: string) => string;

export const getMainPageUrl: RoutePathFunction = (locale) => (`/${locale}${RoutePath.main}`);

export const getConfirmEmailPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.confirm_email}`;

export const getConfirmEmailSuccessPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.confirm_email_success}`;

export const getResetPasswordPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.reset_password}`;

export const getResetPasswordVerifyPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.reset_password_verify}`;

export const getProfileInfoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_info}`;

export const getHostPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host}`;

export const getHostRegistrationUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_registration}`;

export const getHostGalleryPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_gallery}`;

export const getHostVideoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_video}`;

export const getOffersPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers}`;

export const getOffersWelcomePageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_welcome}`;

export const getOffersWhenPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_when}`;

export const getOffersWherePageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_where}`;

export const getOffersWhoNeedsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_who_needs}`;

export const getOffersDescriptionPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_description}`;

export const getOffersWhatToDoPageUrl: RoutePathFunction = (locale) => `/${locale}/${RoutePath.offers_what_to_do}`;

export const getSignInPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.sign_in}`;

export const getSignUpPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.sign_up}`;

export const getProfileResetPasswordPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_reset_password}`;
