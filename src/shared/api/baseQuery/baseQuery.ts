import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { API_BASE_URL } from "@/shared/constants/api";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
        if (token) {
            headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
        }
        headers.set("Content-Type", "application/json");
        headers.set("accept", "application/json");
        return headers;
    },
});

export const baseQueryMergeJson = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
        if (token) {
            headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
        }
        headers.set("Content-Type", "application/merge-patch+json");
        headers.set("accept", "application/json");
        return headers;
    },
});
