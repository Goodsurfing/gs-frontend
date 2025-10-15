import { AboutProjectPage } from "@/pages/AboutProjectPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { ConfirmEmailPage } from "@/pages/ConfirmEmailPage";
import { ConfirmEmailSuccessPage } from "@/pages/ConfirmEmailSuccessPage";
import { FindJobPage } from "@/pages/FindJobPage";
import { HostDashboardPage } from "@/pages/HostDashboardPage";
import { HostGalleryPage } from "@/pages/HostGalleryPage";
import { HostMainInfoPage } from "@/pages/HostMainInfoPage";
import { HostNotesPage } from "@/pages/HostNotesPage";
import { HostOffersPage } from "@/pages/HostOffersPage";
import { HostPersonalPage } from "@/pages/HostPersonalPage";
import { HostReviewPage } from "@/pages/HostReviewPage";
import { HostTeamPage } from "@/pages/HostTeamPage";
import { HostVideoPage } from "@/pages/HostVideoPage";
import { HostsLayoutPage } from "@/pages/HostsLayoutPage";
import { JournalPersonalPage } from "@/pages/JournalPersonalPage";
import { JournalsPage } from "@/pages/JournalsPage";
import { MainPage } from "@/pages/MainPage";
import { MembershipPage } from "@/pages/MembershipPage";
import { NPOPage } from "@/pages/NPOPage";
import { NewsPage } from "@/pages/NewsPage";
import { NewsPersonalPage } from "@/pages/NewsPersonalPage";
import { OfferConditionsPage } from "@/pages/OfferConditionsPage";
import { OfferFinishingTouchesPage } from "@/pages/OfferFinishingTouches";
import { OfferPersonalPage } from "@/pages/OfferPersonalPage";
import { OfferWelcomePage } from "@/pages/OfferWelcomePage";
import { OfferWhatToDoPage } from "@/pages/OfferWhatToDoPage";
import { OfferWhenPage } from "@/pages/OfferWhenPage";
import { OfferWherePage } from "@/pages/OfferWherePage";
import { OfferWhoNeedsPage } from "@/pages/OfferWhoNeeds";
import { OffersMapPage } from "@/pages/OffersMapPage";
import { OurTeamPage } from "@/pages/OurTeamPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { ProfileInfoPage } from "@/pages/ProfileInfoPage";
import { ProfilePreferencesPage } from "@/pages/ProfilePreferencesPage";
import { ProfilePrivacyPage } from "@/pages/ProfilePrivacyPage";
import { ProfileRolePage } from "@/pages/ProfileRolePage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { ResetPasswordVerifyPage } from "@/pages/ResetPasswordVerifyPage";
import { RulesPage } from "@/pages/RulesPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { VideoPage } from "@/pages/VideoPage";
import { VideoPersonalPage } from "@/pages/VideoPersonalPage";
import { VolunteerArticlesPage } from "@/pages/VolunteerArticlesPage";
import { VolunteerCreateArticlePage } from "@/pages/VolunteerCreateArticlePage/";
import { VolunteerDashboardPage } from "@/pages/VolunteerDashboardPage";
import { VolunteerGalleryPage } from "@/pages/VolunteerGalleryPage";
import { VolunteerNotesPage } from "@/pages/VolunteerNotesPage";
import { VolunteerPersonalPage } from "@/pages/VolunteerPersonalPage";
import { VolunteerReviewPage } from "@/pages/VolunteerReviewPage";
import { VolunteerSkillsPage } from "@/pages/VolunteerSkillsPage";
import { VolunteerSubscribersPage } from "@/pages/VolunteerSubscribersPage";
import { AcademyMainPage } from "@/pages/AcademyMainPage";
import { AcademyCoursePage } from "@/pages/AcademyCoursePage";
import { AdminSignInPage } from "@/pages/AdminSignInPage";

import {
    getAboutProjectPageUrl,
    getAmbassadorsPageUrl,
    getBecomeHostPageUrl,
    getBlogPageUrl,
    getBlogPersonalPageUrl,
    getCategoriesPageUrl,
    getConfirmEmailPageUrl,
    getConfirmEmailSuccessPageUrl,
    getFavoriteOffersPageUrl,
    getFindJobPageUrl,
    getHostDashboardPageUrl,
    getHostGalleryPageUrl,
    getHostNotesPageUrl,
    getHostPageUrl,
    getHostPersonalPageUrl,
    getHostRegistrationUrl,
    getHostReviewPageUrl,
    getHostTeamPageUrl,
    getHostVideoPageUrl,
    getJournalPersonalPageUrl,
    getJournalsPageUrl,
    getMainPageUrl,
    getMembershipPageUrl,
    getMessengerPageCreateUrl,
    getMessengerPageIdUrl,
    getMessengerPageUrl,
    getMyOffersPageUrl,
    getNPOPageUrl,
    getNewsPageUrl,
    getNewsPersonalPageUrl,
    getOfferPersonalPageUrl,
    getOffersConditionsPageUrl,
    getOffersDescriptionPageUrl,
    getOffersFinishingTouchesPageUrl,
    getOffersMapPageUrl,
    getOffersPageUrl,
    getOffersWelcomePageUrl,
    getOffersWhatToDoPageUrl,
    getOffersWhenPageUrl,
    getOffersWherePageUrl,
    getOffersWhoNeedsPageUrl,
    getOurTeamPageUrl,
    getPrivacyPolicyPageUrl,
    getProfileInfoPageUrl,
    getProfilePageUrl,
    getProfilePreferencesPageUrl,
    getProfilePrivacyPageUrl,
    getProfileResetPasswordPageUrl,
    getProfileRolePageUrl,
    getResetPasswordPageUrl,
    getResetPasswordVerifyPageUrl,
    getRulesPageUrl,
    getSignInPageUrl,
    getSignUpPageUrl,
    getVideoPageUrl,
    getVideoPersonalPageUrl,
    getVolunteerArticlesPageUrl,
    getVolunteerCreateArticlePageUrl,
    getVolunteerDashboardPageUrl,
    getVolunteerGalleryPageUrl,
    getVolunteerNotesPageUrl,
    getVolunteerPageUrl,
    getVolunteerPersonalPageUrl,
    getVolunteerReviewPageUrl,
    getVolunteerSkillsPageUrl,
    getVolunteerSubscribersPageUrl,
    getAcademyMainPageUrl,
    getAcademyCoursePageUrl,
    getAcademyLessonPageUrl,
    getEmailExpiredPageUrl,
    getConfirmErrorPageUrl,
    getEmailAlreadyConfirmedPageUrl,
    getAdminSignInPageUrl,
    getAdminUsersPageUrl,
    getAdminPageUrl,
} from "@/shared/config/routes/AppUrls";
import { AuthRoutes } from "@/shared/config/routes/AuthRoutes";

import { PrivateRouteGuard } from "../guards/PrivateRouteGuard";
import { RouteType } from "../types/langRouter";
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPersonalPage } from "@/pages/BlogPersonalPage";
import { BecomeHostPage } from "@/pages/BecomeHostPage";
import { GoodsurfingAmbassadorsPage } from "@/pages/GoodsurfingAmbassadorsPage";
import { AcademyLessonPage } from "@/pages/AcademyLessonPage";
import { EmailExpiredPage } from "@/pages/EmailExpiredPage";
import { ConfirmErrorPage } from "@/pages/ConfirmErrorPage";
import { EmailAlreadyConfirmedPage } from "@/pages/EmailAlreadyConfirmedPage";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { AdminLayoutPage } from "@/pages/AdminLayoutPage";

const publicRoutes: RouteType[] = [
    {
        element: <MainPage />,
        label: "main",
        path: (locale: string) => getMainPageUrl(locale),
    },
    {
        element: <OffersMapPage />,
        label: "offers-map",
        path: (locale: string) => getOffersMapPageUrl(locale),
    },
    {
        // refactor this three Messenger page routes with children routes
        element: AuthRoutes.messenger,
        label: "messenger",
        path: (locale: string) => getMessengerPageUrl(locale),
    },
    {
        element: AuthRoutes.messenger,
        label: "messengerId",
        path: (locale: string) => getMessengerPageIdUrl(locale),
    },
    {
        element: AuthRoutes.messenger,
        label: "messengerCreate",
        path: (locale: string) => getMessengerPageCreateUrl(locale),
    },
    {
        element: <CategoriesPage />,
        label: "categories",
        path: (locale: string) => getCategoriesPageUrl(locale),
    },
    {
        element: AuthRoutes.favorite_offers,
        label: "favorite-offers",
        path: (locale: string) => getFavoriteOffersPageUrl(locale),
    },
    {
        element: <SignInPage />,
        label: "sign-in",
        path: (locale: string) => getSignInPageUrl(locale),
    },
    {
        element: <SignUpPage />,
        label: "sign-up",
        path: (locale: string) => getSignUpPageUrl(locale),
    },
    {
        label: "confirm-email",
        element: <ConfirmEmailPage />,
        path: (locale: string) => getConfirmEmailPageUrl(locale),
    },
    {
        label: "confirm-email-success",
        element: <ConfirmEmailSuccessPage />,
        path: (locale: string) => getConfirmEmailSuccessPageUrl(locale),
    },
    {
        label: "email-expired",
        element: <EmailExpiredPage />,
        path: (locale: string) => getEmailExpiredPageUrl(locale),
    },
    {
        label: "confirm-email",
        element: <ConfirmErrorPage />,
        path: (locale: string) => getConfirmErrorPageUrl(locale),
    },
    {
        label: "email-already-confirmed",
        element: <EmailAlreadyConfirmedPage />,
        path: (locale: string) => getEmailAlreadyConfirmedPageUrl(locale),
    },
    {
        label: "host-layout",
        element: (
            <PrivateRouteGuard>
                <HostsLayoutPage />
            </PrivateRouteGuard>
        ),
        path: (locale: string) => getHostPageUrl(locale),
        children: [
            {
                label: "host-dashboard",
                element: <HostDashboardPage />,
                path: (locale) => getHostDashboardPageUrl(locale),
            },
            {
                label: "host-offers",
                element: <HostOffersPage />,
                path: (locale) => getMyOffersPageUrl(locale),
            },
            {
                label: "host-main-info",
                element: <HostMainInfoPage />,
                path: (locale) => getHostRegistrationUrl(locale),
            },
            {
                label: "host-gallery",
                element: <HostGalleryPage />,
                path: (locale) => getHostGalleryPageUrl(locale),
            },
            {
                label: "host-video",
                element: <HostVideoPage />,
                path: (locale) => getHostVideoPageUrl(locale),
            },
            {
                label: "host-team",
                element: <HostTeamPage />,
                path: (locale) => getHostTeamPageUrl(locale),
            },
            {
                label: "host-review",
                element: <HostReviewPage />,
                path: (locale: string) => getHostReviewPageUrl(locale),
            },
            {
                label: "host-notes",
                element: <HostNotesPage />,
                path: (locale: string) => getHostNotesPageUrl(locale),
            },
        ],
    },
    {
        label: "host-personal",
        element: <HostPersonalPage />,
        path: (locale: string) => getHostPersonalPageUrl(locale),
    },
    {
        label: "offer-layout",
        element: AuthRoutes.offers,
        path: (locale: string) => getOffersPageUrl(locale),
        children: [
            {
                label: "offer-welcome",
                element: <OfferWelcomePage />,
                path: (locale: string) => getOffersWelcomePageUrl(locale),
            },
            {
                label: "offer-description",
                element: <OfferDescriptionPage />,
                path: (locale: string) => getOffersDescriptionPageUrl(locale),
            },
            {
                label: "offer-when",
                element: <OfferWhenPage />,
                path: (locale: string) => getOffersWhenPageUrl(locale),
            },
            {
                label: "offer-where",
                element: <OfferWherePage />,
                path: (locale: string) => getOffersWherePageUrl(locale),
            },
            {
                label: "offer-who-needs",
                element: <OfferWhoNeedsPage />,
                path: (locale: string) => getOffersWhoNeedsPageUrl(locale),
            },
            {
                label: "offer-what-to-do",
                element: <OfferWhatToDoPage />,
                path: (locale: string) => getOffersWhatToDoPageUrl(locale),
            },
            {
                label: "offer-conditions",
                element: <OfferConditionsPage />,
                path: (locale: string) => getOffersConditionsPageUrl(locale),
            },
            {
                label: "offer-finishing-touches",
                element: <OfferFinishingTouchesPage />,
                path: (locale: string) => getOffersFinishingTouchesPageUrl(locale),
            },
        ],
    },
    {
        label: "offer-personal",
        element: <OfferPersonalPage />,
        path: (locale: string) => getOfferPersonalPageUrl(locale),
    },
    {
        label: "volunteer-personal",
        element: <VolunteerPersonalPage />,
        path: (locale: string) => getVolunteerPersonalPageUrl(locale),
    },
    {
        label: "volunteer-layout",
        element: (
            AuthRoutes.volunteer
        ),
        path: (locale: string) => getVolunteerPageUrl(locale),
        children: [
            {
                label: "volunteer-dashboard",
                element: <VolunteerDashboardPage />,
                path: (locale: string) => getVolunteerDashboardPageUrl(locale),
            },
            {
                label: "volunteer-skills",
                element: <VolunteerSkillsPage />,
                path: (locale: string) => getVolunteerSkillsPageUrl(locale),
            },
            {
                label: "volunteer-review",
                element: <VolunteerReviewPage />,
                path: (locale: string) => getVolunteerReviewPageUrl(locale),
            },
            {
                label: "volunteer-notes",
                element: <VolunteerNotesPage />,
                path: (locale: string) => getVolunteerNotesPageUrl(locale),
            },
            {
                label: "volunteer-subscribers",
                element: <VolunteerSubscribersPage />,
                path: (locale: string) => getVolunteerSubscribersPageUrl(locale),
            },
            {
                label: "volunteer-gallery",
                element: <VolunteerGalleryPage />,
                path: (locale: string) => getVolunteerGalleryPageUrl(locale),
            },
            {
                label: "volunteer-create-article",
                element: <VolunteerCreateArticlePage />,
                path: (locale: string) => getVolunteerCreateArticlePageUrl(locale),
            },
            {
                label: "volunteer-articles",
                element: <VolunteerArticlesPage />,
                path: (locale: string) => getVolunteerArticlesPageUrl(locale),
            },
        ],
    },
    {
        label: "membership",
        element: <MembershipPage />,
        path: (locale: string) => getMembershipPageUrl(locale),
    },
    {
        label: "reset-password",
        element: <ResetPasswordPage />,
        path: (locale: string) => getResetPasswordPageUrl(locale),
    },
    {
        label: "reset-password-verify",
        element: <ResetPasswordVerifyPage />,
        path: (locale: string) => getResetPasswordVerifyPageUrl(locale),
    },
    {
        label: "profile",
        element: AuthRoutes.profile,
        path: (locale: string) => getProfilePageUrl(locale),
        children: [
            {
                label: "profile-info",
                element: <ProfileInfoPage />,
                path: (locale: string) => getProfileInfoPageUrl(locale),
            },
            {
                label: "profile-preferences",
                element: <ProfilePreferencesPage />,
                path: (locale: string) => getProfilePreferencesPageUrl(locale),
            },
            {
                label: "reset-password-profile",
                element: AuthRoutes.profile_reset_password,
                path: (locale: string) => getProfileResetPasswordPageUrl(locale),
            },
            {
                label: "profile-role",
                element: <ProfileRolePage />,
                path: (locale: string) => getProfileRolePageUrl(locale),
            },
            {
                label: "profile-privacy",
                element: <ProfilePrivacyPage />,
                path: (locale: string) => getProfilePrivacyPageUrl(locale),
            },
        ],
    },

    {
        label: "about-page",
        element: <AboutProjectPage />,
        path: (locale: string) => getAboutProjectPageUrl(locale),
    },
    {
        label: "npo-page",
        element: <NPOPage />,
        path: (locale: string) => getNPOPageUrl(locale),
    },
    {
        label: "our-team",
        element: <OurTeamPage />,
        path: (locale: string) => getOurTeamPageUrl(locale),
    },
    {
        label: "ambassadors",
        element: <GoodsurfingAmbassadorsPage />,
        path: (locale: string) => getAmbassadorsPageUrl(locale),
    },
    {
        label: "rules",
        element: <RulesPage />,
        path: (locale: string) => getRulesPageUrl(locale),
    },
    {
        label: "find-job",
        element: <FindJobPage />,
        path: (locale: string) => getFindJobPageUrl(locale),
    },
    {
        label: "become-host",
        element: <BecomeHostPage />,
        path: (locale: string) => getBecomeHostPageUrl(locale),
    },
    {
        label: "blog",
        element: <BlogPage />,
        path: (locale: string) => getBlogPageUrl(locale),
    },
    {
        label: "blog-personal",
        element: <BlogPersonalPage />,
        path: (locale: string) => getBlogPersonalPageUrl(locale),
    },
    {
        label: "news",
        element: <NewsPage />,
        path: (locale: string) => getNewsPageUrl(locale),
    },
    {
        label: "news-personal",
        element: <NewsPersonalPage />,
        path: (locale: string) => getNewsPersonalPageUrl(locale),
    },
    {
        label: "journals",
        element: <JournalsPage />,
        path: (locale: string) => getJournalsPageUrl(locale),
    },
    {
        label: "journal-personal",
        element: <JournalPersonalPage />,
        path: (locale: string) => getJournalPersonalPageUrl(locale),
    },
    {
        label: "video",
        element: <VideoPage />,
        path: (locale: string) => getVideoPageUrl(locale),
    },
    {
        label: "video-personal",
        element: <VideoPersonalPage />,
        path: (locale: string) => getVideoPersonalPageUrl(locale),
    },
    {
        label: "rules",
        element: <PrivacyPolicyPage />,
        path: (locale: string) => getPrivacyPolicyPageUrl(locale),
    },
    {
        label: "academy-main",
        element: <AcademyMainPage />,
        path: (locale: string) => getAcademyMainPageUrl(locale),
    },
    {
        label: "academy-course",
        element: <AcademyCoursePage />,
        path: (locale: string) => getAcademyCoursePageUrl(locale),
    },
    {
        label: "academy-lesson",
        element: <AcademyLessonPage />,
        path: (locale: string) => getAcademyLessonPageUrl(locale),
    },
    // Admin dashboard
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
        ],
    },
];

// todo: make private routes
export const allRoutes = [...publicRoutes];
