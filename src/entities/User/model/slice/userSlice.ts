import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    TOKEN_LOCALSTORAGE_KEY,
    USER_LOCALSTORAGE_KEY,
    MERCURE_TOKEN_LOCALSTORAGE_KEY,
    ROLES_LOCALSTORAGE_KEY,
} from "@/shared/constants/localstorage";
import { User, UserSchema } from "../types/userSchema";

const initialState: UserSchema = {
    _inited: false,
    authData: undefined,
};

export const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<User & { rememberMe: boolean }>) => {
            const {
                username, token, mercureToken, rememberMe, roles,
            } = action.payload;

            state.authData = {
                username, token, mercureToken, roles,
            };

            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({ username }));
            storage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token));
            storage.setItem(MERCURE_TOKEN_LOCALSTORAGE_KEY, JSON.stringify(mercureToken));
            storage.setItem(ROLES_LOCALSTORAGE_KEY, JSON.stringify(roles));
        },
        initAuthData: (state) => {
            const getFromStorage = (key: string) => localStorage.getItem(key)
            || sessionStorage.getItem(key);

            const userRaw = getFromStorage(USER_LOCALSTORAGE_KEY);
            const rolesRaw = getFromStorage(ROLES_LOCALSTORAGE_KEY);
            const tokenRaw = getFromStorage(TOKEN_LOCALSTORAGE_KEY);
            const mercureTokenRaw = getFromStorage(MERCURE_TOKEN_LOCALSTORAGE_KEY);

            if (userRaw && tokenRaw && mercureTokenRaw && rolesRaw) {
                const user = JSON.parse(userRaw);
                const roles = JSON.parse(rolesRaw);
                const token = JSON.parse(tokenRaw);
                const mercureToken = JSON.parse(mercureTokenRaw);

                state.authData = {
                    ...user,
                    token,
                    mercureToken,
                    roles,
                };
            }

            state._inited = true;
        },
        logout: (state) => {
            state.authData = undefined;

            [localStorage, sessionStorage].forEach((storage) => {
                storage.removeItem(USER_LOCALSTORAGE_KEY);
                storage.removeItem(ROLES_LOCALSTORAGE_KEY);
                storage.removeItem(TOKEN_LOCALSTORAGE_KEY);
                storage.removeItem(MERCURE_TOKEN_LOCALSTORAGE_KEY);
            });
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
