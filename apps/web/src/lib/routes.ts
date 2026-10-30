import { type Locale, localePrefix } from "@/i18n/config";

/**
 * Адреса страниц — те же, что у старого фронта (src/shared/config/routes в
 * корне): ссылки, письма и закладки должны работать без изменений.
 */
// У русского префикса нет: главная — «/», у en/es — «/en», «/es»
const path = (locale: Locale, rest = "") => `${localePrefix(locale)}${rest}` || "/";

export const routes = {
    main: (l: Locale) => path(l),
    offersMap: (l: Locale) => path(l, "/offers-map"),
    offersMapCategory: (l: Locale, categoryId: number) => path(l, `/offers-map?category=${categoryId}`),
    blog: (l: Locale) => path(l, "/blog"),
    blogArticle: (l: Locale, slug: string) => path(l, `/blog/${slug}`),
    categories: (l: Locale) => path(l, "/categories"),
    createArticle: (l: Locale) => path(l, "/volunteer/create-article"),
    video: (l: Locale) => path(l, "/video"),
    ambassadors: (l: Locale) => path(l, "/ambassadors"),
    academy: (l: Locale) => path(l, "/academy-main"),
    academyCourse: (l: Locale, id: string) => path(l, `/academy-course/${id}`),
    academyLesson: (l: Locale, id: string) => path(l, `/academy-lesson/${id}`),
    npo: (l: Locale) => path(l, "/npo"),
    ourTeam: (l: Locale) => path(l, "/our-team"),
    membership: (l: Locale) => path(l, "/membership"),
    rules: (l: Locale) => path(l, "/rules"),
    privacyPolicy: (l: Locale) => path(l, "/privacy-policy"),
    news: (l: Locale) => path(l, "/news"),
    aboutProject: (l: Locale) => path(l, "/about-project"),
    findJob: (l: Locale) => path(l, "/find-job"),
    feedback: (l: Locale) => path(l, "/feedback"),
    becomeHost: (l: Locale) => path(l, "/become-host"),
    paymentSecurityPolicy: (l: Locale) => path(l, "/payment-security-policy"),
    offer: (l: Locale, id: string | number) => path(l, `/offers/${id}`),
    /** Мастер вакансии начинается с «Где» */
    offerEdit: (l: Locale, id: string | number) => path(l, `/offers/where/${id}`),
    organization: (l: Locale, id: string) => path(l, `/organizations/${id}`),
    hostInfo: (l: Locale) => path(l, "/host/info"),
    journals: (l: Locale) => path(l, "/journals"),
    donationsMap: (l: Locale) => path(l, "/donation-map"),
    donationRating: (l: Locale) => path(l, "/donation-rating"),
    donationReports: (l: Locale) => path(l, "/donation-reports"),
    /** Публичная страница сбора */
    fundraise: (l: Locale, id: string) => path(l, `/fundraise/${id}`),
    /** Мастер сбора начинается с «Где» */
    fundraiseEdit: (l: Locale, id: string) => path(l, `/fundraise/where/${id}`),
    donationPay: (l: Locale, id: string) => path(l, `/donation/pay/${id}`),
    /** Сюда возвращает ЮKassa (бэкенд: YookassaProvider, return_url) */
    donationSuccess: (l: Locale, id: string) => path(l, `/donation/success/${id}`),
    donationFail: (l: Locale, id: string) => path(l, `/donation/fail/${id}`),
    signIn: (l: Locale) => path(l, "/signin"),
    signUp: (l: Locale) => path(l, "/signup"),
    resetPassword: (l: Locale) => path(l, "/reset-password"),
    confirmEmail: (l: Locale) => path(l, "/confirm-email"),
    /** Сюда перенаправляет бэкенд из писем (VerifyEmailController, ResetPasswordRedirectController) */
    confirmEmailSuccess: (l: Locale) => path(l, "/confirm-email-success"),
    confirmError: (l: Locale) => path(l, "/confirm-error"),
    emailAlreadyConfirmed: (l: Locale) => path(l, "/email-already-confirmed"),
    emailExpired: (l: Locale) => path(l, "/email-expired"),
    resetPasswordVerify: (l: Locale) => path(l, "/reset-password-verify"),
    unsubscribed: (l: Locale) => path(l, "/unsubscribed"),
    verifyEmail: (l: Locale) => path(l, "/verify-email"),
    verifyEmailHash: (l: Locale, hash: string) => path(l, `/verify-email-hash/${hash}`),
    profilePrivacy: (l: Locale) => path(l, "/profile/privacy"),
    /** Оплата членства; тариф — в ?tariff= */
    payment: (l: Locale) => path(l, "/payment"),
    /** Сюда возвращает ЮKassa после оплаты членства (бэкенд: YookassaProvider, ?payment_id=) */
    paymentSuccess: (l: Locale) => path(l, "/payment/success"),
    paymentFail: (l: Locale) => path(l, "/payment/fail"),
    myOffers: (l: Locale) => path(l, "/host/my-offers"),
    messenger: (l: Locale) => path(l, "/messenger"),
    profileInfo: (l: Locale) => path(l, "/profile/info"),
    profileRole: (l: Locale) => path(l, "/profile/role"),
    profilePreferences: (l: Locale) => path(l, "/profile/preferences"),
    profileResetPassword: (l: Locale) => path(l, "/profile/reset-password"),
    hostDashboard: (l: Locale) => path(l, "/host/host-dashboard"),
    volunteerDashboard: (l: Locale) => path(l, "/volunteer/volunteer-dashboard"),
    /** Публичная страница волонтёра; {id} подставляется в браузере */
    volunteerPublic: (l: Locale, id: string) => path(l, `/volunteers/${id}`),
    volunteerPublicTemplate: (l: Locale) => path(l, "/volunteers/{id}"),
} as const;

export const EXPEDITIONS_URL = "https://expedition.goodsurfing.org/";
export const INTERNATIONAL_URL = "https://international.goodsurfing.org/";
export const PUBLIC_OFFER_PDF = "/assets/docs/npo/Публичная_оферта.pdf";
