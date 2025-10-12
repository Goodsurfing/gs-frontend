import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    TOKEN_ADMIN_LOCALSTORAGE_KEY,
} from "@/shared/constants/localstorage";
import { Admin, AdminSchema } from "../types/adminSchema";

const initialState: AdminSchema = {
    authData: undefined,
};

export const adminSlice = createSlice({
    name: "authAdmin",
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<Admin & { rememberMe: boolean }>) => {
            const {
                token, rememberMe,
            } = action.payload;

            state.authData = { token };

            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem(TOKEN_ADMIN_LOCALSTORAGE_KEY, JSON.stringify(token));
        },
        initAuthData: (state) => {
            const getFromStorage = (key: string) => localStorage.getItem(key)
            || sessionStorage.getItem(key);

            const tokenRaw = getFromStorage(TOKEN_ADMIN_LOCALSTORAGE_KEY);

            if (tokenRaw) {
                const token = JSON.parse(tokenRaw);

                state.authData = {
                    token,
                };
            }
        },
        logout: (state) => {
            state.authData = undefined;

            [localStorage, sessionStorage].forEach((storage) => {
                storage.removeItem(TOKEN_ADMIN_LOCALSTORAGE_KEY);
            });
        },
    },
});

export const { actions: adminActions } = adminSlice;
export const { reducer: adminReducer } = adminSlice;
