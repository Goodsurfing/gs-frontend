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
        setAuthData: (state, action: PayloadAction<User>) => {
            const {
                username, token, mercureToken, rememberMe, roles,
            } = action.payload;

            state.authData = {
                username,
                token,
                mercureToken,
                rememberMe,
                roles,
            };

            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({ username }));
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token));
            localStorage.setItem(MERCURE_TOKEN_LOCALSTORAGE_KEY, JSON.stringify(mercureToken));
            localStorage.setItem(ROLES_LOCALSTORAGE_KEY, JSON.stringify(roles));
        },
        initAuthData: (state) => {
            const userRaw = localStorage.getItem(USER_LOCALSTORAGE_KEY);
            const rolesRaw = localStorage.getItem(ROLES_LOCALSTORAGE_KEY);
            const tokenRaw = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
            const mercureTokenRaw = localStorage.getItem(MERCURE_TOKEN_LOCALSTORAGE_KEY);

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

            [localStorage].forEach((storage) => {
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
