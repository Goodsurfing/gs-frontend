import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { AuthApiEndpoints } from "@/types/api/auth";

import { API_BASE_URL } from "@/shared/constants/api";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        headers.set("accept", "application/json");
        return headers;
    },
});

interface LoginResponse {
    token: string;
}

interface LoginByEmail {
    email: string;
    security: {
        credentials: {
            password: string;
        };
    };
}

export const loginApi = createApi({
    reducerPath: "loginApi",
    baseQuery,
    endpoints: (build) => ({
        loginUser: build.mutation<LoginResponse, LoginByEmail>({
            query: (data: LoginByEmail) => ({
                url: AuthApiEndpoints.LOGIN,
                method: "POST",
                body: data,
            }),
        }),
    }),
});
