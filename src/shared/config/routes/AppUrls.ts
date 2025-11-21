import { RoutePath } from "./RouterConfig";

export type RoutePathFunction = (locale: string | Locale, id?: string, extraId?: string) => string;

// Main page

export const getMainPageUrl: RoutePathFunction = (locale) => (`/${locale}${RoutePath.main}`);

// Offers map page

export const getOffersMapPageUrl: RoutePathFunction = (locale) => (`/${locale}${RoutePath.offers_map}`);

// Messenger page

export const getMessengerPageUrl: RoutePathFunction = (locale) => (`/${locale}${RoutePath.messenger}`);

export const getMessengerPageIdUrl: RoutePathFunction = (locale, id = ":id") => (`/${locale}${RoutePath.messenger}/${id}`);

export const getMessengerPageCreateUrl: RoutePathFunction = (locale, id = ":id", offerId = ":offerId") => (`/${locale}${RoutePath.messenger}/${id}/${offerId}`);

// Categires page

export const getCategoriesPageUrl: RoutePathFunction = (locale) => (`/${locale}${RoutePath.categories}`);

// Favorite offers page

export const getFavoriteOffersPageUrl: RoutePathFunction = (locale) => (`/${locale}${RoutePath.favorite_offers}`);

// Auth bounded pages

export const getConfirmEmailPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.confirm_email}`;

export const getConfirmEmailSuccessPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.confirm_email_success}`;

export const getEmailExpiredPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.email_expired}`;

export const getEmailAlreadyConfirmedPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.email_already_confirmed}`;

export const getVerifyEmailPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.verify_email}`;

export const getVerifyEmailHashPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.verify_email_hash}/${id}`;

export const getConfirmErrorPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.confirm_error}`;

export const getResetPasswordPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.reset_password}`;

export const getResetPasswordVerifyPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.reset_password_verify}`;

export const getSignInPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.sign_in}`;

export const getSignUpPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.sign_up}`;

// Profile pages

export const getProfilePageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile}`;

export const getProfileResetPasswordPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_reset_password}`;

export const getProfileInfoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_info}`;

export const getProfilePrivacyPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_privacy}`;

export const getProfilePreferencesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_preferences}`;

export const getProfileRolePageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.profile_role}`;

// Host pages

export const getHostPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host}`;

export const getHostDashboardPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.dashboard}`;

export const getMyOffersPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.my_offers}`;

// Host / organization pages

export const getHostRegistrationUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers_registration}`;

export const getHostGalleryPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_gallery}`;

export const getHostReviewPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_review}`;

export const getHostNotesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_notes}`;

export const getHostVideoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_video}`;

export const getHostTeamPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.host_team}`;

export const getHostPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.host_personal}/${id}`;

// Offers pages

export const getOffersPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.offers}`;

export const getOffersWelcomePageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_welcome}/${id}`;

export const getOffersWhenPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_when}/${id}`;

export const getOffersWherePageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_where}/${id}`;

export const getOffersWhoNeedsPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_who_needs}/${id}`;

export const getOffersDescriptionPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_description}/${id}`;

export const getOffersWhatToDoPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_what_to_do}/${id}`;

export const getOffersConditionsPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_conditions}/${id}`;

export const getOffersFinishingTouchesPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offers_finishing_touches}/${id}`;

export const getOfferPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.offer_personal}/${id}`;

// Volunteer pages

export const getVolunteerPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer}`;

export const getVolunteerDashboardPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_dashboard}`;

export const getVolunteerSkillsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_skills}`;

export const getVolunteerReviewPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_review}`;

export const getVolunteerNotesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_notes}`;

export const getVolunteerSubscribersPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_subscribers}`;

export const getVolunteerGalleryPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_gallery}`;

export const getVolunteerCreateArticlePageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_create_article}`;

export const getVolunteerArticlesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.volunteer_articles}`;

export const getVolunteerPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.volunteer_personal}/${id}`;

// Other pages

export const getMembershipPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.membership}`;

export const getAboutProjectPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.about_project}`;

export const getNPOPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.npo}`;

export const getOurTeamPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.our_team}`;

export const getAmbassadorsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.ambassadors}`;

export const getRulesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.rules}`;

export const getFindJobPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.find_job}`;

export const getBecomeHostPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.become_host}`;

export const getBlogPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.blog}`;

export const getBlogPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.blog}/${id}`;

export const getNewsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.news}`;

export const getNewsPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.news}/${id}`;

export const getPrivacyPolicyPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.privacy_policy}`;

export const getJournalsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.journals}`;

export const getJournalPersonalPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.journals}/:id`;

export const getVideoPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.video}`;

export const getVideoPersonalPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.video}/:id`;

// Academy pages

export const getAcademyMainPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.academy_main}`;

export const getAcademyCoursePageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.academy_course}/${id}`;

export const getAcademyLessonPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.academy_lesson}/${id}`;

// Admin pages

export const getAdminPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin}`;

export const getAdminSignInPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin_sign_in}`;

export const getAdminUsersPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin_users}`;

export const getAdminPersonalUserPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.admin_users}/${id}`;

export const getAdminOrganizationsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin_organizations}`;

export const getAdminPersonalOrganizationPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.admin_organizations}/${id}`;

export const getAdminSkillsAchievementsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin_skills_achievements}`;

export const getAdminSkillPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.admin_skill_personal}/${id}`;

export const getAdminAchievementPersonalPageUrl: RoutePathFunction = (locale, id = ":id") => `/${locale}${RoutePath.admin_achievement_personal}/${id}`;

export const getAdminVacanciesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin_vacancies}`;

export const getAdminCategoriesVacanciesPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin_categories_vacancies}`;

export const getAdminReviewsPageUrl: RoutePathFunction = (locale) => `/${locale}${RoutePath.admin_reviews}`;
