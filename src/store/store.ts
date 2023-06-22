import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authApi, reauthApi } from "@/store/api/authApi";
import { userInfoApi } from "@/store/api/userInfoApi";

import { localeApi } from "./api/localeApi";
import loginReducer from "./reducers/loginSlice";
import registerReducer from "./reducers/registerSlice";
import { organizationApi } from "./api/organizationApi";
import toastReducer from "./reducers/toastSlice";
import { userOrganizationInfoApi } from "./api/userOrganizationInfoApi";
import { galleryApi, galleryReducer } from "@/modules/Gallery";
import { userReducer } from "@/entities/User";

const rootReducer = combineReducers({
    register: registerReducer,
    login: loginReducer,
    toast: toastReducer,
    user: userReducer,
    gallery: galleryReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userInfoApi.reducerPath]: userInfoApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [reauthApi.reducerPath]: reauthApi.reducer,
    [userOrganizationInfoApi.reducerPath]: userOrganizationInfoApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat([
                authApi.middleware,
                organizationApi.middleware,
                userInfoApi.middleware,
                userOrganizationInfoApi.middleware,
                localeApi.middleware,
                galleryApi.middleware,
            ]);
        },
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
