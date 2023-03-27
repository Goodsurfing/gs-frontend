import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authApi, reauthApi } from "@/store/api/authApi";
import { userInfoApi } from "@/store/api/userInfoApi";

import { localeApi } from "./api/localeApi";
import loginReducer from "./reducers/loginSlice";
import registerReducer from "./reducers/registerSlice";
import { organizationApi } from "./api/organizationApi";
import toastReducer from './reducers/toastSlice';

const rootReducer = combineReducers({
    register: registerReducer,
    login: loginReducer,
    toast: toastReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userInfoApi.reducerPath]: userInfoApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [reauthApi.reducerPath]: authApi.reducer,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat([
                authApi.middleware,
                organizationApi.middleware,
                userInfoApi.middleware,
                localeApi.middleware,
            ]);
        },
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
