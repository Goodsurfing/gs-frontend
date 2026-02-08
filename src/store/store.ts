import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authApi } from "@/store/api/authApi";

import { localeApi } from "./api/localeApi";

import { userReducer } from "@/entities/User";

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
import { adminReducer, adminApi, adminCourseApi } from "@/entities/Admin";

const rootReducer = combineReducers({
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
    [adminApi.reducerPath]: adminApi.reducer,
    [adminCourseApi.reducerPath]: adminCourseApi.reducer,
});

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
        adminApi.middleware,
        adminCourseApi.middleware,
        authMiddleware,
    ]),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
