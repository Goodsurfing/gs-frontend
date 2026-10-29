import { Locale } from "@/entities/Locale";
import { RoutePath } from "./RouterConfig";
import { localePrefix } from "@/shared/config/routes/localePath";

export type RoutePathFunction = (locale: string | Locale, id?: string, extraId?: string) => string;

// Main page

export const getMainPageUrl: RoutePathFunction = (locale) => (`${localePrefix(locale)}${RoutePath.main}`);

// Offers map page

export const getOffersMapPageUrl: RoutePathFunction = (locale) => (`${localePrefix(locale)}${RoutePath.offers_map}`);

// Messenger page

export const getMessengerPageUrl: RoutePathFunction = (locale) => (`${localePrefix(locale)}${RoutePath.messenger}`);

export const getMessengerPageIdUrl: RoutePathFunction = (locale, id = ":id") => (`${localePrefix(locale)}${RoutePath.messenger}/${id}`);

export const getMessengerPageCreateUrl: RoutePathFunction = (locale, id = ":id", offerId = ":offerId") => (`${localePrefix(locale)}${RoutePath.messenger}/${id}/${offerId}`);

// Categires page

export const getCategoriesPageUrl: RoutePathFunction = (locale) => (`${localePrefix(locale)}${RoutePath.categories}`);

// Favorite offers page

export const getFavoriteOffersPageUrl: RoutePathFunction = (locale) => (`${localePrefix(locale)}${RoutePath.favorite_offers}`);

// Auth bounded pages

export const getConfirmEmailPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.confirm_email}`;

export const getSubscriptionPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.subscription}`;

export const getConfirmEmailSuccessPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.confirm_email_success}`;

export const getEmailExpiredPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.email_expired}`;

export const getEmailAlreadyConfirmedPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.email_already_confirmed}`;

export const getVerifyEmailPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.verify_email}`;

export const getVerifyEmailHashPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.verify_email_hash}/${id}`;

export const getConfirmErrorPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.confirm_error}`;

export const getResetPasswordPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.reset_password}`;

export const getResetPasswordVerifyPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.reset_password_verify}`;

export const getSignInPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.sign_in}`;

export const getSignUpPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.sign_up}`;

// Profile pages

export const getProfilePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.profile}`;

export const getProfileResetPasswordPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.profile_reset_password}`;

export const getProfileInfoPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.profile_info}`;

export const getProfilePrivacyPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.profile_privacy}`;

export const getProfilePreferencesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.profile_preferences}`;

export const getProfileRolePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.profile_role}`;

// Host pages

export const getHostPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host}`;

export const getHostDashboardPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.dashboard}`;

export const getMyOffersPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.my_offers}`;

// Host / organization pages

export const getHostRegisterPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_register}`;

export const getHostInfoUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_info}`;

export const getHostGalleryPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_gallery}`;

export const getHostReviewPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_review}`;

export const getHostNotesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_notes}`;

export const getHostDonationsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_donations}`;

export const getHostDonationRatingPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_donation_rating}`;

export const getFundraisePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.fundraise}`;

export const getFundraiseWelcomePageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.fundraise_welcome}/${id}`;

export const getFundraiseStepPageUrl: RoutePathFunction = (
    locale,
    step = ":step",
    id = ":id",
) => `${localePrefix(locale)}${RoutePath.fundraise}/${step}/${id}`;

export const getHostVideoPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_video}`;

export const getHostTeamPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.host_team}`;

export const getHostPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.host_personal}/${id}`;

// Offers pages

export const getOffersPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.offers}`;

export const getOffersWelcomePageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_welcome}/${id}`;

export const getOffersWhenPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_when}/${id}`;

export const getOffersWherePageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_where}/${id}`;

export const getOffersWhoNeedsPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_who_needs}/${id}`;

export const getOffersDescriptionPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_description}/${id}`;

export const getOffersWhatToDoPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_what_to_do}/${id}`;

export const getOffersConditionsPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_conditions}/${id}`;

export const getOffersFinishingTouchesPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offers_finishing_touches}/${id}`;

export const getOfferPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.offer_personal}/${id}`;

// Volunteer pages

export const getVolunteerPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer}`;

export const getVolunteerDashboardPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_dashboard}`;

export const getVolunteerSkillsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_skills}`;

export const getVolunteerReviewPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_review}`;

export const getVolunteerNotesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_notes}`;

export const getVolunteerDonationsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_donations}`;

export const getVolunteerSubscribersPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_subscribers}`;

export const getVolunteerGalleryPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_gallery}`;

export const getVolunteerCreateArticlePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_create_article}`;

export const getVolunteerArticlesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.volunteer_articles}`;

export const getVolunteerArticlesPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.volunteer_articles}/${id}`;

export const getVolunteerPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.volunteer_personal}/${id}`;

// Other pages

export const getMembershipPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.membership}`;

export const getPaymentPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.payment}`;

export const getPaymentSuccessPageUrl: RoutePathFunction = (locale, paymentId?: string) => {
    const baseUrl = `${localePrefix(locale)}${RoutePath.payment_success}`;
    return paymentId ? `${baseUrl}?payment_id=${paymentId}` : baseUrl;
};

export const getPaymentFailPageUrl: RoutePathFunction = (locale, paymentId?: string) => {
    const baseUrl = `${localePrefix(locale)}${RoutePath.payment_fail}`;
    return paymentId ? `${baseUrl}?payment_id=${paymentId}` : baseUrl;
};

export const getAboutProjectPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.about_project}`;

export const getNPOPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.npo}`;

export const getOurTeamPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.our_team}`;

export const getAmbassadorsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.ambassadors}`;

export const getRulesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.rules}`;

export const getFindJobPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.find_job}`;

export const getBecomeHostPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.become_host}`;

export const getBlogPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.blog}`;

export const getBlogPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.blog}/${id}`;

export const getNewsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.news}`;

export const getNewsPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.news}/${id}`;

export const getPrivacyPolicyPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.privacy_policy}`;

export const getPaymentSecurityPolicyPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.payment_security_policy}`;

export const getFeedbackPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.feedback}`;

export const getJournalsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.journals}`;

export const getJournalPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.journals}/${id}`;

export const getVideoPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.video}`;

export const getVideoPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.video}/${id}`;

// Academy pages

export const getAcademyMainPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.academy_main}`;

export const getAcademyCoursePageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.academy_course}/${id}`;

export const getAcademyLessonPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.academy_lesson}/${id}`;

// Donation

export const getDonationsMapPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.donation_map}`;

export const getDonationPersonalPage: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.donation_personal}/${id}`;

export const getDonationReports: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.donation_reports}`;

export const getDonationRating: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.donation_rating}`;

export const getDonationPayPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.donation_pay}/${id}`;

export const getDonationPaySuccessPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.donation_pay_success}/${id}`;

export const getDonationPayFailPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.donation_pay_fail}/${id}`;

// Admin pages

export const getAdminPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin}`;

export const getAdminSignInPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_sign_in}`;

// Admin users

export const getAdminUsersPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_users}`;

export const getAdminPersonalUserPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_users}/${id}`;

// Admin organizations

export const getAdminOrganizationsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_organizations}`;

export const getAdminPersonalOrganizationPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_organizations}/${id}`;

// Admin skills

export const getAdminSkillsAchievementsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_skills_achievements}`;

export const getAdminSkillCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_skill_personal}/create`;

export const getAdminSkillPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_skill_personal}/${id}`;

// Admin achievements

export const getAdminAchievementCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_achievement_personal}/create`;

export const getAdminAchievementPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_achievement_personal}/${id}`;

// Admin vacancies

export const getAdminVacanciesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_vacancies}`;

export const getAdminVacancyPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_vacancy}`;

export const getAdminVacancyWherePageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_vacancy_where}/${id}`;

export const getAdminVacancyWhenPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_vacancy_when}/${id}`;

export const getAdminVacancyWhoNeedsPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_vacancy_who_needs}/${id}`;

export const getAdminVacancyDescriptionPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_vacancy_description}/${id}`;

export const getAdminVacancyWhatToDoPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_vacancy_what_to_do}/${id}`;

export const getAdminVacancyConditionsPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_vacancy_conditions}/${id}`;

export const getAdminVacancyFinishingTouchesPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_vacancy_finishing_touches}/${id}`;

// Admin categories

export const getAdminCategoriesVacanciesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_categories_vacancies}`;

export const getAdminCategoriesVacanciesPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_categories_vacancies}/${id}`;

export const getAdminCategoriesVacanciesCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_categories_vacancies}/create`;

// Admin conditions

export const getAdminConditionsVacanciesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_conditions_vacancies}`;

export const getAdminHouseVacanciesCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_house_vacancies_personal}/create`;

export const getAdminHouseVacanciesPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_house_vacancies_personal}/${id}`;

export const getAdminFoodVacanciesCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_food_vacancies_personal}/create`;

export const getAdminFoodVacanciesPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_food_vacancies_personal}/${id}`;

export const getAdminTransferVacanciesCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_transfer_vacancies_personal}/create`;

export const getAdminTransferVacanciesPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_transfer_vacancies_personal}/${id}`;

// Admin reviews

export const getAdminReviewsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_reviews}`;

export const getAdminReviewVacancyPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_review_vacancy_personal}/${id}`;

export const getAdminReviewVolunteerPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_review_volunteer_personal}/${id}`;

//  Admin Academy

export const getAdminCoursesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_courses}`;

export const getAdminCoursePersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_courses}/${id}`;

export const getAdminCourseCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_courses}/create`;

//  Admin Review Courses

export const getAdminReviewsCoursesPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_reviews_courses}`;

export const getAdminReviewCoursePersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_reviews_courses}/${id}`;

// Admin News

export const getAdminNewsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_news}`;

export const getAdminNewsCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_news}/create`;

export const getAdminNewsPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_news}/${id}`;

// Admin Review Community

export const getAdminReviewsCommunityPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_reviews_community}`;

export const getAdminReviewsNewsPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_reviews_news}/${id}`;

// Admin Categories Blog

export const getAdminCategoriesBlogPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_categories_blog}`;

export const getAdminCategoriesBlogCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_categories_blog}/create`;

export const getAdminCategoriesBlogPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_categories_blog}/${id}`;

// Admin Blog

export const getAdminBlogPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_blog}`;

export const getAdminBlogPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_blog}/${id}`;

export const getAdminBlogCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_blog}/create`;

export const getAdminReviewBlogPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_reviews_blog}/${id}`;

// Admin Journals

export const getAdminJournalsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_journal}`;

export const getAdminJournalCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_journal}/create`;

export const getAdminJournalPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_journal}/${id}`;

export const getAdminReviewJournalPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_reviews_journals}/${id}`;

// Admin Video

export const getAdminVideoPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_video}`;

export const getAdminVideoPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_video}/${id}`;

export const getAdminVideoCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_video}/create`;

export const getAdminReviewVideoPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_reviews_video}/${id}`;

// Admin Donation

export const getAdminDonationReportsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_donation_reports}`;

export const getAdminDonationReportPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_donation_reports}/${id}`;

export const getAdminDonationReportCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_donation_reports}/create`;

export const getAdminDonationsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_donation}`;

export const getAdminDonationsPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_donation}/${id}`;

// Admin Ambassadors

export const getAdminAmbassadorsPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_ambassador}`;

export const getAdminAmbassadorCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_ambassador}/create`;

export const getAdminAmbassadorPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_ambassador}/${id}`;

// Admin About Project

export const getAdminAboutProjectPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_about_project}`;

// Admin Our Team

export const getAdminOurTeamPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_our_team}`;

export const getAdminOurTeamCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_our_team}/create`;

export const getAdminOurTeamPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_our_team}/${id}`;

// Admin System Admin

export const getAdminSystemAdminPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_system_admin}`;

export const getAdminSystemAdminCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_system_admin}/create`;

// Admin Banner Marketing

export const getAdminBannerMarketingPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_banner_marketing}`;

export const getAdminBannerMarketingCreatePageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_banner_marketing}/create`;

export const getAdminBannerMarketingPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_banner_marketing}/${id}`;

// Admin Feedback

export const getAdminFeedbackPageUrl: RoutePathFunction = (locale) => `${localePrefix(locale)}${RoutePath.admin_feedback}`;

export const getAdminFeedbackPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `${localePrefix(locale)}${RoutePath.admin_feedback}/${id}`;
