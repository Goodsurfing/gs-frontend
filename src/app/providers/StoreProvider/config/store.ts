import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { localeApi } from "features/SwitchLanguage";

import { organizationReducer } from "entities/Organization";
import { userReducer } from "entities/User";

import { StateSchema } from "./StateSchema";

const rootReducers = combineReducers<StateSchema>({
  organization: organizationReducer,
  user: userReducer,
  [localeApi.reducerPath]: localeApi.reducer,
});

export function createReduxStore(initialState?: StateSchema) {
  return configureStore({
    reducer: rootReducers,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
      localeApi.middleware,
    ]),
    devTools: __IS_DEV__,
  });
}

export type RootState = ReturnType<typeof rootReducers>;
export type AppStore = ReturnType<typeof createReduxStore>;
export type AppDispatch = AppStore["dispatch"];
