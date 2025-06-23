import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import qs from "qs";
import { RootState } from "@/store/store";

import { API_BASE_URL } from "@/shared/constants/api";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.user.authData?.token
            || JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
            || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        headers.set("accept", "application/json");
        return headers;
    },
});

export const baseQueryAcceptJson = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.user.authData?.token
            || JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
            || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        // headers.set("Content-Type", "application/merge-patch+json");
        headers.set("accept", "application/json");
        return headers;
    },
    paramsSerializer: (params) => qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
    }),
});
