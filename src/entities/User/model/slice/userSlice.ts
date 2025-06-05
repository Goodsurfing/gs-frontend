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
        setAuthData: (state, action: PayloadAction<User>) => {
            const { username, token, mercureToken } = action.payload;

            state.authData = action.payload;

            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({ username }));
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token));
            localStorage.setItem(MERCURE_TOKEN_LOCALSTORAGE_KEY, JSON.stringify(mercureToken));
        },
        initAuthData: (state) => {
            const userRaw = localStorage.getItem(USER_LOCALSTORAGE_KEY);
            const tokenRaw = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
            const mercureTokenRaw = localStorage.getItem(MERCURE_TOKEN_LOCALSTORAGE_KEY);

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
            localStorage.removeItem(USER_LOCALSTORAGE_KEY);
            localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
            localStorage.removeItem(MERCURE_TOKEN_LOCALSTORAGE_KEY);
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
