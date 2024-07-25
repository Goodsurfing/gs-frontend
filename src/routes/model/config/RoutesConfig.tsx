import { ConfirmEmailPage } from "@/pages/ConfirmEmailPage";
import { ConfirmEmailSuccessPage } from "@/pages/ConfirmEmailSuccessPage";
import { HostDashboardPage } from "@/pages/HostDashboardPage";
import { HostGalleryPage } from "@/pages/HostGalleryPage";
import { HostMainInfoPage } from "@/pages/HostMainInfoPage";
import { HostOffersPage } from "@/pages/HostOffersPage";
import { HostReviewPage } from "@/pages/HostReviewPage";
import { HostTeamPage } from "@/pages/HostTeamPage";
import { HostVideoPage } from "@/pages/HostVideoPage";
import { HostNotesPage } from "@/pages/HostNotesPage";
import { HostsLayoutPage } from "@/pages/HostsLayoutPage";
import { HostPersonalPage } from "@/pages/HostPersonalPage";
import { MainPage } from "@/pages/MainPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { OfferConditionsPage } from "@/pages/OfferConditionsPage";
import { OfferFinishingTouchesPage } from "@/pages/OfferFinishingTouches";
import { OfferLayoutPage } from "@/pages/OfferLayoutPage/OfferLayoutPage";
import { OfferPersonalPage } from "@/pages/OfferPersonalPage";
import { OfferWelcomePage } from "@/pages/OfferWelcomePage";
import { OfferWhatToDoPage } from "@/pages/OfferWhatToDoPage";
import { OfferWhenPage } from "@/pages/OfferWhenPage";
import { OfferWherePage } from "@/pages/OfferWherePage";
import { OfferWhoNeedsPage } from "@/pages/OfferWhoNeeds";
import { ProfileInfoPage } from "@/pages/ProfileInfoPage";
import { ProfilePreferencesPage } from "@/pages/ProfilePreferencesPage";
import { ProfilePrivacyPage } from "@/pages/ProfilePrivacyPage";
import { ProfileRolePage } from "@/pages/ProfileRolePage";
import { VolunteerLayoutPage } from "@/pages/VolunteerLayoutPage";
import { VolunteerDashboardPage } from "@/pages/VolunteerDashboardPage";
import { VolunteerSkillsPage } from "@/pages/VolunteerSkillsPage";
import { VolunteerReviewPage } from "@/pages/VolunteerReviewPage";
import { VolunteerNotesPage } from "@/pages/VolunteerNotesPage";
import { VolunteerSubscribersPage } from "@/pages/VolunteerSubscribersPage";
import { VolunteerGalleryPage } from "@/pages/VolunteerGalleryPage";
import { VolunteerCreateArticlePage } from "@/pages/VolunteerCreateArticlePage/";
import { VolunteerArticlesPage } from "@/pages/VolunteerArticlesPage";
import { VolunteerPersonalPage } from "@/pages/VolunteerPersonalPage";
import { MembershipPage } from "@/pages/MembershipPage";
import { AboutProjectPage } from "@/pages/AboutProjectPage";
import { NPOPage } from "@/pages/NPOPage";
import { RulesPage } from "@/pages/RulesPage";
import { FindJobPage } from "@/pages/FindJobPage";
import { NewsPage } from "@/pages/NewsPage";
import { NewsPersonalPage } from "@/pages/NewsPersonalPage";
import { OurTeamPage } from "@/pages/OurTeamPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { JournalsPage } from "@/pages/JournalsPage";
import { JournalPersonalPage } from "@/pages/JournalPersonalPage";
import { VideoPage } from "@/pages/VideoPage";
import { VideoPersonalPage } from "@/pages/VideoPersonalPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { ResetPasswordVerifyPage } from "@/pages/ResetPasswordVerifyPage";

import { OffersMapPage } from "@/pages/OffersMapPage";
import { MessengerPage } from "@/pages/MessengerPage";

import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";

import {
    getConfirmEmailPageUrl,
    getConfirmEmailSuccessPageUrl,
    getHostDashboardPageUrl,
    getHostGalleryPageUrl,
    getHostPageUrl,
    getHostRegistrationUrl,
    getHostReviewPageUrl,
    getHostNotesPageUrl,
    getHostTeamPageUrl,
    getHostVideoPageUrl,
    getHostPersonalPageUrl,
    getMainPageUrl,
    getCategoriesPageUrl,
    getMyOffersPageUrl,
    getOfferPersonalPageUrl,
    getOffersConditionsPageUrl,
    getOffersDescriptionPageUrl,
    getOffersFinishingTouchesPageUrl,
    getOffersPageUrl,
    getOffersWelcomePageUrl,
    getOffersWhatToDoPageUrl,
    getOffersWhenPageUrl,
    getOffersWherePageUrl,
    getOffersWhoNeedsPageUrl,
    getProfileInfoPageUrl,
    getProfilePreferencesPageUrl,
    getProfilePrivacyPageUrl,
    getProfileResetPasswordPageUrl,
    getProfileRolePagePageUrl,
    getResetPasswordPageUrl,
    getResetPasswordVerifyPageUrl,
    getSignInPageUrl,
    getSignUpPageUrl,
    getVolunteerPersonalPageUrl,
    getVolunteerPageUrl,
    getVolunteerDashboardPageUrl,
    getVolunteerSkillsPageUrl,
    getVolunteerReviewPageUrl,
    getVolunteerNotesPageUrl,
    getVolunteerSubscribersPageUrl,
    getVolunteerGalleryPageUrl,
    getVolunteerCreateArticlePageUrl,
    getVolunteerArticlesPageUrl,
    getMembershipPageUrl,
    getAboutProjectPageUrl,
    getNPOPageUrl,
    getOurTeamPageUrl,
    getRulesPageUrl,
    getNewsPageUrl,
    getPrivacyPolicyPageUrl,
    getNewsPersonalPageUrl,
    getFindJobPageUrl,
    getJournalsPageUrl,
    getJournalPersonalPageUrl,
    getVideoPageUrl,
    getVideoPersonalPageUrl,
    getOffersMapPageUrl,
    getMessengerPageUrl,
    getMessengerPageIdUrl,
    getMessengerPageCreateUrl,
    getProfilePageUrl,
} from "@/shared/config/routes/AppUrls";

import { PrivateRouteGuard } from "../guards/PrivateRouteGuard";
import { RouteType } from "../types/langRouter";
import { AuthRoutes } from "@/shared/config/routes/AuthRoutes";
import { ProfileLayoutPage } from "@/pages/ProfileLayoutPage";

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
        element: <MessengerPage />,
        label: "messenger",
        path: (locale: string) => getMessengerPageUrl(locale),
    },
    {
        element: <MessengerPage />,
        label: "messengerId",
        path: (locale: string) => getMessengerPageIdUrl(locale),
    },
    {
        element: <MessengerPage />,
        label: "messengerCreate",
        path: (locale: string) => getMessengerPageCreateUrl(locale),
    },
    {
        element: <CategoriesPage />,
        label: "categories",
        path: (locale: string) => getCategoriesPageUrl(locale),
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
        label: "host-layout",
        element: <HostsLayoutPage />,
        path: (locale: string) => getHostPageUrl(locale),
        children: [
            {
                label: "host-dashboard",
                element: <HostDashboardPage />,
                index: true,
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
        element: (
            <HostPersonalPage />
        ),
        path: (locale: string) => getHostPersonalPageUrl(locale),
    },
    {
        label: "offer-layout",
        element: <OfferLayoutPage />,
        path: (locale: string) => getOffersPageUrl(locale),
        children: [
            {
                label: "offer-welcome",
                element: <OfferWelcomePage />,
                path: (locale: string) => getOffersWelcomePageUrl(locale),
            },
            {
                label: "offer-description",
                element: AuthRoutes.offers_description,
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
        element: <VolunteerLayoutPage />,
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
        element: <ProfileLayoutPage />,
        path: (locale: string) => getProfilePageUrl(locale),
        children: [
            {
                label: "profile-info",
                element: (
                    <PrivateRouteGuard>
                        <ProfileInfoPage />
                    </PrivateRouteGuard>
                ),
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
                path: (locale: string) => getProfileRolePagePageUrl(locale),
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
];

// todo: make private routes
export const allRoutes = [...publicRoutes];
