import {
    LegacyIdRedirect,
} from "@/shared/ui/LegacyIdRedirect/LegacyIdRedirect";

import {
    AdminSignInPage,
} from "@/pages/AdminSignInPage";

import {
    getHostPersonalPageUrl,
    getOfferPersonalPageUrl,
    getVolunteerPersonalPageUrl,
    getAdminSignInPageUrl,
    getAdminUsersPageUrl,
    getAdminPageUrl,
    getAdminPersonalUserPageUrl,
    getAdminOrganizationsPageUrl,
    getAdminPersonalOrganizationPageUrl,
    getAdminSkillsAchievementsPageUrl,
    getAdminSkillPersonalPageUrl,
    getAdminAchievementPersonalPageUrl,
    getAdminCategoriesVacanciesPageUrl,
    getAdminCategoriesVacanciesPersonalPageUrl,
    getAdminCategoriesVacanciesCreatePageUrl,
    getAdminSkillCreatePageUrl,
    getAdminAchievementCreatePageUrl,
    getAdminConditionsVacanciesPageUrl,
    getAdminHouseVacanciesCreatePageUrl,
    getAdminHouseVacanciesPersonalPageUrl,
    getAdminFoodVacanciesCreatePageUrl,
    getAdminFoodVacanciesPersonalPageUrl,
    getAdminTransferVacanciesCreatePageUrl,
    getAdminTransferVacanciesPersonalPageUrl,
    getAdminReviewsPageUrl,
    getAdminReviewVacancyPersonalPageUrl,
    getAdminReviewVolunteerPersonalPageUrl,
    getAdminVacanciesPageUrl,
    getAdminVacancyPageUrl,
    getAdminVacancyWherePageUrl,
    getAdminVacancyWhenPageUrl,
    getAdminVacancyWhatToDoPageUrl,
    getAdminVacancyConditionsPageUrl,
    getAdminVacancyWhoNeedsPageUrl,
    getAdminVacancyDescriptionPageUrl,
    getAdminVacancyFinishingTouchesPageUrl,
    getAdminCoursesPageUrl,
    getAdminCourseCreatePageUrl,
    getAdminCoursePersonalPageUrl,
    getAdminReviewsCoursesPageUrl,
    getAdminReviewCoursePersonalPageUrl,
    getAdminNewsPageUrl,
    getAdminNewsPersonalPageUrl,
    getAdminNewsCreatePageUrl,
    getAdminReviewsCommunityPageUrl,
    getAdminReviewsNewsPersonalPageUrl,
    getAdminCategoriesBlogPageUrl,
    getAdminCategoriesBlogCreatePageUrl,
    getAdminCategoriesBlogPersonalPageUrl,
    getAdminBlogPageUrl,
    getAdminBlogPersonalPageUrl,
    getAdminJournalsPageUrl,
    getAdminJournalCreatePageUrl,
    getAdminJournalPersonalPageUrl,
    getAdminReviewJournalPersonalPageUrl,
    getAdminVideoPageUrl,
    getAdminVideoPersonalPageUrl,
    getAdminReviewVideoPersonalPageUrl,
    getDonationPersonalPage,
    getAdminDonationReportsPageUrl,
    getAdminDonationReportCreatePageUrl,
    getAdminDonationReportPersonalPageUrl,
    getAdminBlogCreatePageUrl,
    getAdminVideoCreatePageUrl,
    getAdminReviewBlogPersonalPageUrl,
    getAdminDonationsPageUrl,
    getAdminAmbassadorsPageUrl,
    getAdminAmbassadorCreatePageUrl,
    getAdminAmbassadorPersonalPageUrl,
    getAdminAboutProjectPageUrl,
    getAdminOurTeamPageUrl,
    getAdminOurTeamPersonalPageUrl,
    getAdminOurTeamCreatePageUrl,
    getAdminSystemAdminPageUrl,
    getAdminSystemAdminCreatePageUrl,
    getAdminBannerMarketingPageUrl,
    getAdminBannerMarketingCreatePageUrl,
    getAdminBannerMarketingPersonalPageUrl,
    getAdminFeedbackPageUrl,
    getAdminFeedbackPersonalPageUrl,
    getAdminMembershipLogPageUrl,
} from "@/shared/config/routes/AppUrls";

import {
    RouteType,
} from "../types/langRouter";

import {
    AdminUsersPage,
} from "@/pages/AdminUsersPage";
import {
    AdminLayoutPage,
} from "@/pages/AdminLayoutPage";
import {
    AdminUserPersonalPage,
} from "@/pages/AdminUserPersonalPage";
import {
    AdminOrganizationsPage,
} from "@/pages/AdminOrganizationsPage";
import {
    AdminPersonalOrganizationPage,
} from "@/pages/AdminPersonalOrganizationPage";
import {
    AdminSkillsAchievementsPage,
} from "@/pages/AdminSkillAchievementsPage";
import {
    AdminSkillPersonalPage,
} from "@/pages/AdminSkillPersonalPage";
import {
    AdminAchievementPersonalPage,
} from "@/pages/AdminAchievementPersonalPage";
import {
    AdminCategoriesPage,
} from "@/pages/AdminCategoriesPage";
import {
    AdminCategoriesPersonalPage,
} from "@/pages/AdminCategoriesPersonalPage";
import {
    AdminCategoriesCreatePage,
} from "@/pages/AdminCategoriesCreatePage";
import {
    AdminSkillCreatePage,
} from "@/pages/AdminSkillCreatePage";
import {
    AdminAchievementsCreatePage,
} from "@/pages/AdminAchievementsCreatePage";
import {
    AdminConditionsOfferPage,
} from "@/pages/AdminConditionsOfferPage";
import {
    AdminHousePersonalPage,
} from "@/pages/AdminHousePersonalPage";
import {
    AdminHouseCreatePage,
} from "@/pages/AdminHouseCreatePage";
import {
    AdminFoodCreatePage,
} from "@/pages/AdminFoodCreatePage";
import {
    AdminFoodPersonalPage,
} from "@/pages/AdminFoodPersonalPage";
import {
    AdminTransferCreatePage,
} from "@/pages/AdminTransferCreatePage";
import {
    AdminTransferPersonalPage,
} from "@/pages/AdminTransferPersonalPage";
import {
    AdminReviewPage,
} from "@/pages/AdminReviewPage";
import {
    AdminReviewVacanciesPersonalPage,
} from "@/pages/AdminReviewVacanciesPersonalPage";
import {
    AdminReviewVolunteerPersonalPage,
} from "@/pages/AdminReviewVolunteerPersonalPage";
import {
    AdminOffersPage,
} from "@/pages/AdminOffersPage";
import {
    AdminOfferLayoutPage,
} from "@/pages/AdminOfferLayoutPage";
import {
    AdminOfferWherePage,
} from "@/pages/AdminOfferWherePage";
import {
    AdminOfferWhenPage,
} from "@/pages/AdminOfferWhenPage";
import {
    AdminOfferWhatToDoPage,
} from "@/pages/AdminOfferWhatToDoPage";
import {
    AdminOfferConditionsPage,
} from "@/pages/AdminOfferConditionsPage";

import {
    AdminOfferWhoNeedsPage,
} from "@/pages/AdminOfferWhoNeedsPage";
import {
    AdminOfferDescriptionPage,
} from "@/pages/AdminOfferDescriptionPage";
import {
    AdminOfferFinishingTouchesPage,
} from "@/pages/AdminOfferFinishingTouchesPage";
import {
    AdminCoursesPage,
} from "@/pages/AdminCoursesPage";
import {
    AdminCourseCreatePage,
} from "@/pages/AdminCourseCreatePage";
import {
    AdminCoursePersonalPage,
} from "@/pages/AdminCoursePersonalPage";
import {
    AdminReviewsCoursesPage,
} from "@/pages/AdminReviewsCoursesPage";
import {
    AdminReviewCoursePersonalPage,
} from "@/pages/AdminReviewCoursePersonalPage";
import {
    AdminNewsPage,
} from "@/pages/AdminNewsPage";
import {
    AdminNewsPersonalPage,
} from "@/pages/AdminNewsPersonalPage";
import {
    AdminNewsCreatePage,
} from "@/pages/AdminNewsCreatePage";
import {
    AdminReviewsCommunityPage,
} from "@/pages/AdminReviewsCommunityPage";
import {
    AdminReviewNewsPersonalPage,
} from "@/pages/AdminReviewNewsPersonalPage";
import {
    AdminCategoriesBlogPage,
} from "@/pages/AdminCategoriesBlogPage";
import {
    AdminCategoriesBlogCreatePage,
} from "@/pages/AdminCategoriesBlogCreatePage";
import {
    AdminCategoriesBlogPersonalPage,
} from "@/pages/AdminCategoriesBlogPersonalPage";

import {
    AdminBlogPage,
} from "@/pages/AdminBlogPage";
import {
    AdminBlogPersonalPage,
} from "@/pages/AdminBlogPersonalPage";
import {
    AdminJournalPage,
} from "@/pages/AdminJournalPage";
import {
    AdminJournalCreatePage,
} from "@/pages/AdminJournalCreatePage";
import {
    AdminJournalPersonalPage,
} from "@/pages/AdminJournalPersonalPage";
import {
    AdminReviewJournalPersonalPage,
} from "@/pages/AdminReviewJournalPersonalPage";
import {
    AdminVideoPage,
} from "@/pages/AdminVideoPage";
import {
    AdminVideoPersonalPage,
} from "@/pages/AdminVideoPersonalPage";
import {
    AdminReviewVideoPersonalPage,
} from "@/pages/AdminRevieVideoPersonalPage";

import {
    AdminDonationReportsPage,
} from "@/pages/AdminDonationReportsPage";
import {
    AdminDonationReportCreatePage,
} from "@/pages/AdminDonationReportCreatePage";
import {
    AdminDonationReportPersonalPage,
} from "@/pages/AdminDonationReportPersonalPage";

import {
    AdminBlogCreatePage,
} from "@/pages/AdminBlogCreatePage";
import {
    AdminVideoCreatePage,
} from "@/pages/AdminVideoCreatePage";
import {
    AdminReviewBlogPersonalPage,
} from "@/pages/AdminReviewBlogPersonalPage";
import {
    AdminDonationsPage,
} from "@/pages/AdminDonationsPage";
import {
    AdminAmbassadorsPage,
} from "@/pages/AdminAmbassadorsPage";
import AdminAmbassadorCreatePage from "@/pages/AdminAmbassadorCreatePage/ui/AdminAmbassadorCreatePage";
import {
    AdminAmbassadorPersonalPage,
} from "@/pages/AdminAmbassadorPersonalPage";
import {
    AdminAboutProjectPersonalPage,
} from "@/pages/AdminAboutProjectPersonalPage";
import {
    AdminOurTeamPage,
} from "@/pages/AdminOurTeamPage";
import {
    AdminOurTeamPersonalPage,
} from "@/pages/AdminOurTeamPersonalPage";
import {
    AdminOurTeamCreatePage,
} from "@/pages/AdminOurTeamCreatePage";

import {
    AdminSystemAdminPage,
} from "@/pages/AdminSystemAdminPage";
import {
    AdminSystemAdminCreatePage,
} from "@/pages/AdminSystemAdminCreatePage";
import {
    AdminBannerMarketingPage,
} from "@/pages/AdminBannerMarketingPage";
import {
    AdminBannerMarketingCreatePage,
} from "@/pages/AdminBannerMarketingCreatePage";
import {
    AdminBannerMarketingPersonalPage,
} from "@/pages/AdminBannerMarketingPersonalPage";
import {
    AdminFeedbackPage,
} from "@/pages/AdminFeedbackPage";
import {
    AdminFeedbackPersonalPage,
} from "@/pages/AdminFeedbackPersonalPage";
import {
    AdminMembershipLogPage,
} from "@/pages/AdminMembershipLogPage";
import {
    localePrefix,
} from "@/shared/config/routes/localePath";

const publicRoutes: RouteType[] = [
    {
        label: "host-personal-legacy-redirect",
        element: <LegacyIdRedirect to={getHostPersonalPageUrl} />,
        path: (locale: string) => `${localePrefix(locale)}/host-personal/:id`,
    },
    {
        label: "offer-personal-legacy-redirect",
        element: <LegacyIdRedirect to={getOfferPersonalPageUrl} />,
        path: (locale: string) => `${localePrefix(locale)}/offer-personal/:id`,
    },
    {
        label: "volunteer-personal-legacy-redirect",
        element: <LegacyIdRedirect to={getVolunteerPersonalPageUrl} />,
        path: (locale: string) => `${localePrefix(locale)}/volunteer-personal/:id`,
    },
    {
        label: "donation-personal-legacy-redirect",
        element: <LegacyIdRedirect to={getDonationPersonalPage} />,
        path: (locale: string) => `${localePrefix(locale)}/donation-personal/:id`,
    },
    {
        label: "admin-sign-in",
        element: <AdminSignInPage />,
        path: (locale: string) => getAdminSignInPageUrl(locale),
    },
    {
        label: "admin",
        element: <AdminLayoutPage />,
        path: (locale: string) => getAdminPageUrl(locale),
        children: [
            {
                label: "admin-users",
                element: <AdminUsersPage />,
                path: (locale: string) => getAdminUsersPageUrl(locale),
            },
            {
                label: "admin-user-personal",
                element: <AdminUserPersonalPage />,
                path: (locale: string) => getAdminPersonalUserPageUrl(locale),
            },
            {
                label: "admin-organizations",
                element: <AdminOrganizationsPage />,
                path: (locale: string) => getAdminOrganizationsPageUrl(locale),
            },
            {
                label: "admin-organization-personal",
                element: <AdminPersonalOrganizationPage />,
                path: (locale: string) => getAdminPersonalOrganizationPageUrl(locale),
            },
            {
                label: "admin-skills-achievements",
                element: <AdminSkillsAchievementsPage />,
                path: (locale: string) => getAdminSkillsAchievementsPageUrl(locale),
            },
            {
                label: "admin-skill-create",
                element: <AdminSkillCreatePage />,
                path: (locale: string) => getAdminSkillCreatePageUrl(locale),
            },
            {
                label: "admin-skill-personal",
                element: <AdminSkillPersonalPage />,
                path: (locale: string) => getAdminSkillPersonalPageUrl(locale),
            },
            {
                label: "admin-achievement-create",
                element: <AdminAchievementsCreatePage />,
                path: (locale: string) => getAdminAchievementCreatePageUrl(locale),
            },
            {
                label: "admin-achievement-personal",
                element: <AdminAchievementPersonalPage />,
                path: (locale: string) => getAdminAchievementPersonalPageUrl(locale),
            },
            {
                label: "admin-categories-vacancies",
                element: <AdminCategoriesPage />,
                path: (locale: string) => getAdminCategoriesVacanciesPageUrl(locale),
            },
            {
                label: "admin-categories-vacancies-create",
                element: <AdminCategoriesCreatePage />,
                path: (locale: string) => getAdminCategoriesVacanciesCreatePageUrl(locale),
            },
            {
                label: "admin-categories-vacancies-personal",
                element: <AdminCategoriesPersonalPage />,
                path: (locale: string) => getAdminCategoriesVacanciesPersonalPageUrl(locale),
            },
            {
                label: "admin-conditions-vacancies",
                element: <AdminConditionsOfferPage />,
                path: (locale: string) => getAdminConditionsVacanciesPageUrl(locale),
            },
            {
                label: "admin-house-create",
                element: <AdminHouseCreatePage />,
                path: (locale: string) => getAdminHouseVacanciesCreatePageUrl(locale),
            },
            {
                label: "admin-house-personal",
                element: <AdminHousePersonalPage />,
                path: (locale: string) => getAdminHouseVacanciesPersonalPageUrl(locale),
            },
            {
                label: "admin-food-create",
                element: <AdminFoodCreatePage />,
                path: (locale: string) => getAdminFoodVacanciesCreatePageUrl(locale),
            },
            {
                label: "admin-food-personal",
                element: <AdminFoodPersonalPage />,
                path: (locale: string) => getAdminFoodVacanciesPersonalPageUrl(locale),
            },
            {
                label: "admin-transfer-create",
                element: <AdminTransferCreatePage />,
                path: (locale: string) => getAdminTransferVacanciesCreatePageUrl(locale),
            },
            {
                label: "admin-transfer-personal",
                element: <AdminTransferPersonalPage />,
                path: (locale: string) => getAdminTransferVacanciesPersonalPageUrl(locale),
            },
            {
                label: "admin-reviews",
                element: <AdminReviewPage />,
                path: (locale: string) => getAdminReviewsPageUrl(locale),
            },
            {
                label: "admin-review-vacancy-personal",
                element: <AdminReviewVacanciesPersonalPage />,
                path: (locale: string) => getAdminReviewVacancyPersonalPageUrl(locale),
            },
            {
                label: "admin-review-volunteer-personal",
                element: <AdminReviewVolunteerPersonalPage />,
                path: (locale: string) => getAdminReviewVolunteerPersonalPageUrl(locale),
            },
            {
                label: "admin-offers",
                element: <AdminOffersPage />,
                path: (locale: string) => getAdminVacanciesPageUrl(locale),
            },
            {
                label: "admin-courses",
                element: <AdminCoursesPage />,
                path: (locale: string) => getAdminCoursesPageUrl(locale),
            },
            {
                label: "admin-course-create",
                element: <AdminCourseCreatePage />,
                path: (locale: string) => getAdminCourseCreatePageUrl(locale),
            },
            {
                label: "admin-course-personal",
                element: <AdminCoursePersonalPage />,
                path: (locale: string) => getAdminCoursePersonalPageUrl(locale),
            },
            {
                label: "admin-reviews-courses",
                element: <AdminReviewsCoursesPage />,
                path: (locale: string) => getAdminReviewsCoursesPageUrl(locale),
            },
            {
                label: "admin-review-course-personal",
                element: <AdminReviewCoursePersonalPage />,
                path: (locale: string) => getAdminReviewCoursePersonalPageUrl(locale),
            },
            {
                label: "admin-news",
                element: <AdminNewsPage />,
                path: (locale: string) => getAdminNewsPageUrl(locale),
            },
            {
                label: "admin-news-personal",
                element: <AdminNewsPersonalPage />,
                path: (locale: string) => getAdminNewsPersonalPageUrl(locale),
            },
            {
                label: "admin-news-create",
                element: <AdminNewsCreatePage />,
                path: (locale: string) => getAdminNewsCreatePageUrl(locale),
            },
            {
                label: "admin-reviews-community",
                element: <AdminReviewsCommunityPage />,
                path: (locale: string) => getAdminReviewsCommunityPageUrl(locale),
            },
            {
                label: "admin-review-news-personal",
                element: <AdminReviewNewsPersonalPage />,
                path: (locale: string) => getAdminReviewsNewsPersonalPageUrl(locale),
            },
            {
                label: "admin-categories-blog",
                element: <AdminCategoriesBlogPage />,
                path: (locale: string) => getAdminCategoriesBlogPageUrl(locale),
            },
            {
                label: "admin-categories-blog-create",
                element: <AdminCategoriesBlogCreatePage />,
                path: (locale: string) => getAdminCategoriesBlogCreatePageUrl(locale),
            },
            {
                label: "admin-categories-blog-personal",
                element: <AdminCategoriesBlogPersonalPage />,
                path: (locale: string) => getAdminCategoriesBlogPersonalPageUrl(locale),
            },
            {
                label: "admin-blog",
                element: <AdminBlogPage />,
                path: (locale: string) => getAdminBlogPageUrl(locale),
            },
            {
                label: "admin-blog-personal",
                element: <AdminBlogPersonalPage />,
                path: (locale: string) => getAdminBlogPersonalPageUrl(locale),
            },
            {
                label: "admin-blog-create",
                element: <AdminBlogCreatePage />,
                path: (locale: string) => getAdminBlogCreatePageUrl(locale),
            },
            {
                label: "admin-review-blog-personal",
                element: <AdminReviewBlogPersonalPage />,
                path: (locale: string) => getAdminReviewBlogPersonalPageUrl(locale),
            },
            {
                label: "admin-journal",
                element: <AdminJournalPage />,
                path: (locale: string) => getAdminJournalsPageUrl(locale),
            },
            {
                label: "admin-journal-create",
                element: <AdminJournalCreatePage />,
                path: (locale: string) => getAdminJournalCreatePageUrl(locale),
            },
            {
                label: "admin-journal-personal",
                element: <AdminJournalPersonalPage />,
                path: (locale: string) => getAdminJournalPersonalPageUrl(locale),
            },
            {
                label: "admin-review-journal-personal",
                element: <AdminReviewJournalPersonalPage />,
                path: (locale: string) => getAdminReviewJournalPersonalPageUrl(locale),
            },
            {
                label: "admin-video",
                element: <AdminVideoPage />,
                path: (locale: string) => getAdminVideoPageUrl(locale),
            },
            {
                label: "admin-video-personal",
                element: <AdminVideoPersonalPage />,
                path: (locale: string) => getAdminVideoPersonalPageUrl(locale),
            },
            {
                label: "admin-video-create",
                element: <AdminVideoCreatePage />,
                path: (locale: string) => getAdminVideoCreatePageUrl(locale),
            },
            {
                label: "admin-review-video-personal",
                element: <AdminReviewVideoPersonalPage />,
                path: (locale: string) => getAdminReviewVideoPersonalPageUrl(locale),
            },
            {
                label: "admin-donation-reports",
                element: <AdminDonationReportsPage />,
                path: (locale: string) => getAdminDonationReportsPageUrl(locale),
            },
            {
                label: "admin-donation-report-create",
                element: <AdminDonationReportCreatePage />,
                path: (locale: string) => getAdminDonationReportCreatePageUrl(locale),
            },
            {
                label: "admin-donation-report-personal",
                element: <AdminDonationReportPersonalPage />,
                path: (locale: string) => getAdminDonationReportPersonalPageUrl(locale),
            },
            {
                label: "admin-donations",
                element: <AdminDonationsPage />,
                path: (locale: string) => getAdminDonationsPageUrl(locale),
            },
            {
                label: "admin-ambassadors",
                element: <AdminAmbassadorsPage />,
                path: (locale: string) => getAdminAmbassadorsPageUrl(locale),
            },
            {
                label: "admin-ambassador-create",
                element: <AdminAmbassadorCreatePage />,
                path: (locale: string) => getAdminAmbassadorCreatePageUrl(locale),
            },
            {
                label: "admin-ambassador-personal",
                element: <AdminAmbassadorPersonalPage />,
                path: (locale: string) => getAdminAmbassadorPersonalPageUrl(locale),
            },
            {
                label: "admin-about-project",
                element: <AdminAboutProjectPersonalPage />,
                path: (locale: string) => getAdminAboutProjectPageUrl(locale),
            },
            {
                label: "admin-our-team",
                element: <AdminOurTeamPage />,
                path: (locale: string) => getAdminOurTeamPageUrl(locale),
            },
            {
                label: "admin-our-team-personal",
                element: <AdminOurTeamPersonalPage />,
                path: (locale: string) => getAdminOurTeamPersonalPageUrl(locale),
            },
            {
                label: "admin-our-team-create",
                element: <AdminOurTeamCreatePage />,
                path: (locale: string) => getAdminOurTeamCreatePageUrl(locale),
            },
            {
                label: "admin-system-admin",
                element: <AdminSystemAdminPage />,
                path: (locale: string) => getAdminSystemAdminPageUrl(locale),
            },
            {
                label: "admin-system-admin-create",
                element: <AdminSystemAdminCreatePage />,
                path: (locale: string) => getAdminSystemAdminCreatePageUrl(locale),
            },
            {
                label: "admin-banner-marketing",
                element: <AdminBannerMarketingPage />,
                path: (locale: string) => getAdminBannerMarketingPageUrl(locale),
            },
            {
                label: "admin-banner-marketing-create",
                element: <AdminBannerMarketingCreatePage />,
                path: (locale: string) => getAdminBannerMarketingCreatePageUrl(locale),
            },
            {
                label: "admin-banner-marketing-personal",
                element: <AdminBannerMarketingPersonalPage />,
                path: (locale: string) => getAdminBannerMarketingPersonalPageUrl(locale),
            },
            {
                label: "admin-feedback",
                element: <AdminFeedbackPage />,
                path: (locale: string) => getAdminFeedbackPageUrl(locale),
            },
            {
                label: "admin-feedback-personal",
                element: <AdminFeedbackPersonalPage />,
                path: (locale: string) => getAdminFeedbackPersonalPageUrl(locale),
            },
            {
                label: "admin-membership-log",
                element: <AdminMembershipLogPage />,
                path: (locale: string) => getAdminMembershipLogPageUrl(locale),
            },
        ],
    },
    {
        label: "admin-offer-layout",
        element: <AdminOfferLayoutPage />,
        path: (locale: string) => getAdminVacancyPageUrl(locale),
        children: [
            {
                label: "admin-offer-where",
                element: <AdminOfferWherePage />,
                path: (locale: string) => getAdminVacancyWherePageUrl(locale),
            },
            {
                label: "admin-offer-when",
                element: <AdminOfferWhenPage />,
                path: (locale: string) => getAdminVacancyWhenPageUrl(locale),
            },
            {
                label: "admin-offer-who-needs",
                element: <AdminOfferWhoNeedsPage />,
                path: (locale: string) => getAdminVacancyWhoNeedsPageUrl(locale),
            },
            {
                label: "admin-offer-descrition",
                element: <AdminOfferDescriptionPage />,
                path: (locale: string) => getAdminVacancyDescriptionPageUrl(locale),
            },
            {
                label: "admin-offer-what-to-do",
                element: <AdminOfferWhatToDoPage />,
                path: (locale: string) => getAdminVacancyWhatToDoPageUrl(locale),
            },
            {
                label: "admin-offer-conditions",
                element: <AdminOfferConditionsPage />,
                path: (locale: string) => getAdminVacancyConditionsPageUrl(locale),
            },
            {
                label: "admin-offer-finishing-touches",
                element: <AdminOfferFinishingTouchesPage />,
                path: (locale: string) => getAdminVacancyFinishingTouchesPageUrl(locale),
            },
        ],
    },
];

export const allRoutes = [...publicRoutes];
