import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authApi } from "@/store/api/authApi";

import { localeApi } from "./api/localeApi";

import { userReducer, userActions } from "@/entities/User";

import { profileApi, profileReducer } from "@/entities/Profile";

import { galleryApi, galleryReducer } from "@/entities/Gallery";

import registerReducer from "./reducers/registerSlice";
import { userOrganizationInfoApi } from "./api/userOrganizationInfoApi";
import { organizationApi } from "./api/organizationApi";
import { hostApi } from "@/entities/Host";
import { offerApi } from "@/entities/Offer";
import { authMiddleware } from "./middlewares/authMiddleware";
import { reviewApi } from "@/entities/Review";
import { volunteerApi } from "@/entities/Volunteer";
import { chatApi } from "@/entities/Chat";
import {
    adminReducer, adminApi, adminCourseApi, adminNewsApi,
    adminBlogApi,
    adminJournalApi,
    adminVideoApi,
    adminDonationApi,
    adminOurTeamApi,
    adminSystemApi,
    adminBannerMarketingApi,
    adminFeedbackApi,
} from "@/entities/Admin";
import { courseApi } from "@/entities/Academy";
import { newsApi } from "@/entities/News";
import { blogApi } from "@/entities/Blog";
import { journalApi } from "@/entities/Journal";
import { videoApi } from "@/entities/Video";
import { donationApi } from "@/entities/Donation";
import { membershipApi } from "./api/membershipApi";
import { donationPaymentApi } from "./api/donationPaymentApi";
import { feedbackApi } from "@/entities/Feedback";

const combinedReducer = combineReducers({
    register: registerReducer,
    profile: profileReducer,
    gallery: galleryReducer,
    user: userReducer,
    admin: adminReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [userOrganizationInfoApi.reducerPath]: userOrganizationInfoApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [hostApi.reducerPath]: hostApi.reducer,
    [volunteerApi.reducerPath]: volunteerApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [journalApi.reducerPath]: journalApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer,
    [donationApi.reducerPath]: donationApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [adminCourseApi.reducerPath]: adminCourseApi.reducer,
    [adminNewsApi.reducerPath]: adminNewsApi.reducer,
    [adminBlogApi.reducerPath]: adminBlogApi.reducer,
    [adminJournalApi.reducerPath]: adminJournalApi.reducer,
    [adminVideoApi.reducerPath]: adminVideoApi.reducer,
    [adminDonationApi.reducerPath]: adminDonationApi.reducer,
    [membershipApi.reducerPath]: membershipApi.reducer,
    [adminOurTeamApi.reducerPath]: adminOurTeamApi.reducer,
    [donationPaymentApi.reducerPath]: donationPaymentApi.reducer,
    [adminSystemApi.reducerPath]: adminSystemApi.reducer,
    [adminBannerMarketingApi.reducerPath]: adminBannerMarketingApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [adminFeedbackApi.reducerPath]: adminFeedbackApi.reducer,
});

// При выходе из аккаунта сбрасываем весь стейт к initial: это очищает кэши RTK Query
// всех api-слайсов и данные slice'ов (profile/gallery/admin/...), чтобы данные
// предыдущего пользователя не «смешивались» после смены аккаунта (баг П27).
//
// ВАЖНО: полный сброс делаем ТОЛЬКО при выходе из активной сессии (был authData).
// authMiddleware дёргает logout() на любой ответ code:401 — в т.ч. на /profile у
// гостя. Без этой проверки такой logout обнулял бы RTK Query-кэш при активной
// подписке, и запрос профиля залипал в isFetching → форма входа висела на спиннере.
// Для гостя logout проходит обычным slice-редьюсером, кэш не трогаем.
const rootReducer: typeof combinedReducer = (state, action) => {
    if (action.type === userActions.logout.type && state?.user?.authData) {
        const inited = state?.user._inited ?? true;
        const resetState = combinedReducer(undefined, action);
        // resetState заморожен Immer — присваивание в поле кидает в прод-сборке
        // «Cannot assign to read only property '_inited'» и роняет рендер роутера.
        // Возвращаем новый объект иммутабельно.
        return {
            ...resetState,
            user: { ...resetState.user, _inited: inited },
        };
    }

    return combinedReducer(state, action);
};

export const setupStore = () => configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
        authApi.middleware,
        organizationApi.middleware,
        userOrganizationInfoApi.middleware,
        localeApi.middleware,
        profileApi.middleware,
        galleryApi.middleware,
        hostApi.middleware,
        volunteerApi.middleware,
        offerApi.middleware,
        reviewApi.middleware,
        chatApi.middleware,
        courseApi.middleware,
        blogApi.middleware,
        newsApi.middleware,
        journalApi.middleware,
        videoApi.middleware,
        donationApi.middleware,
        adminApi.middleware,
        adminCourseApi.middleware,
        adminNewsApi.middleware,
        adminBlogApi.middleware,
        adminJournalApi.middleware,
        adminVideoApi.middleware,
        adminDonationApi.middleware,
        membershipApi.middleware,
        adminOurTeamApi.middleware,
        donationPaymentApi.middleware,
        adminSystemApi.middleware,
        adminBannerMarketingApi.middleware,
        feedbackApi.middleware,
        adminFeedbackApi.middleware,
        authMiddleware,
    ]),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
