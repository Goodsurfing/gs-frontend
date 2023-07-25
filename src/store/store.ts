import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authApi, reauthApi } from "@/store/api/authApi";
import { userInfoApi } from "@/store/api/userInfoApi";

import { localeApi } from "./api/localeApi";
import { loginApi } from "@/features/AuthByEmail";
import loginReducer from "./reducers/loginSlice";
import registerReducer from "./reducers/registerSlice";
import toastReducer from "./reducers/toastSlice";
import { userOrganizationInfoApi } from "./api/userOrganizationInfoApi";
import { organizationApi } from "./api/organizationApi";
import { galleryApi, galleryReducer } from "@/modules/Gallery";
import { userReducer } from "@/entities/User";

const rootReducer = combineReducers({
    register: registerReducer,
    login: loginReducer,
    toast: toastReducer,
    gallery: galleryReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [userInfoApi.reducerPath]: userInfoApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [reauthApi.reducerPath]: reauthApi.reducer,
    [userOrganizationInfoApi.reducerPath]: userOrganizationInfoApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
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
        galleryApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
