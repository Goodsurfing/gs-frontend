import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authApi, reauthApi } from "store/api/authApi";
import { userInfoApi } from "store/api/userInfoApi";

import { localeApi } from "./api/localeApi";
import { organizationApi } from "./api/organizationApi";
import { userOrganizationInfoApi } from "./api/userOrganizationInfoApi";
import loginReducer from "./reducers/loginSlice";
import registerReducer from "./reducers/registerSlice";
import toastReducer from "./reducers/toastSlice";

const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  toast: toastReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userInfoApi.reducerPath]: userInfoApi.reducer,
  [localeApi.reducerPath]: localeApi.reducer,
  [organizationApi.reducerPath]: organizationApi.reducer,
  [reauthApi.reducerPath]: reauthApi.reducer,
  [userOrganizationInfoApi.reducerPath]: userOrganizationInfoApi.reducer,
});

export const setupStore = () => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    authApi.middleware,
    organizationApi.middleware,
    userInfoApi.middleware,
    userOrganizationInfoApi.middleware,
    localeApi.middleware,
  ]),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
