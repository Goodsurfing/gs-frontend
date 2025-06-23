import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    TOKEN_LOCALSTORAGE_KEY,
    USER_LOCALSTORAGE_KEY,
    MERCURE_TOKEN_LOCALSTORAGE_KEY,
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
                username, token, mercureToken, rememberMe,
            } = action.payload;

            state.authData = { username, token, mercureToken };

            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({ username }));
            storage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token));
            storage.setItem(MERCURE_TOKEN_LOCALSTORAGE_KEY, JSON.stringify(mercureToken));
        },
        initAuthData: (state) => {
            const getFromStorage = (key: string) => localStorage.getItem(key)
            || sessionStorage.getItem(key);

            const userRaw = getFromStorage(USER_LOCALSTORAGE_KEY);
            const tokenRaw = getFromStorage(TOKEN_LOCALSTORAGE_KEY);
            const mercureTokenRaw = getFromStorage(MERCURE_TOKEN_LOCALSTORAGE_KEY);

            if (userRaw && tokenRaw && mercureTokenRaw) {
                const user = JSON.parse(userRaw);
                const token = JSON.parse(tokenRaw);
                const mercureToken = JSON.parse(mercureTokenRaw);

                state.authData = {
                    ...user,
                    token,
                    mercureToken,
                };
            }

            state._inited = true;
        },
        logout: (state) => {
            state.authData = undefined;

            [localStorage, sessionStorage].forEach((storage) => {
                storage.removeItem(USER_LOCALSTORAGE_KEY);
                storage.removeItem(TOKEN_LOCALSTORAGE_KEY);
                storage.removeItem(MERCURE_TOKEN_LOCALSTORAGE_KEY);
            });
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
