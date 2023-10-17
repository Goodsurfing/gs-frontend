import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authApi } from "@/store/api/authApi";
import { userInfoApi } from "@/store/api/userInfoApi";

import { localeApi } from "./api/localeApi";

import { userReducer } from "@/entities/User";

import { profileApi, profileReducer } from "@/entities/Profile";

import { loginApi } from "@/features/AuthByEmail";
import { galleryApi, galleryReducer } from "@/modules/Gallery";

import registerReducer from "./reducers/registerSlice";
import { userOrganizationInfoApi } from "./api/userOrganizationInfoApi";
import { organizationApi } from "./api/organizationApi";
import { hostApi } from "@/entities/Host";

const rootReducer = combineReducers({
    register: registerReducer,
    profile: profileReducer,
    gallery: galleryReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [userInfoApi.reducerPath]: userInfoApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [userOrganizationInfoApi.reducerPath]: userOrganizationInfoApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [hostApi.reducerPath]: hostApi.reducer,
});

export const setupStore = () => configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
        authApi.middleware,
        loginApi.middleware,
        organizationApi.middleware,
        userInfoApi.middleware,
        userOrganizationInfoApi.middleware,
        localeApi.middleware,
        profileApi.middleware,
        galleryApi.middleware,
        hostApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
