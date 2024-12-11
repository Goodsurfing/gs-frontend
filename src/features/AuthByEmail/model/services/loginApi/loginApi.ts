import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { AuthApiEndpoints } from "@/types/api/auth";

import { API_BASE_URL } from "@/shared/constants/api";
import { LoginByEmailProps } from "../../types/login";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        headers.set("accept", "application/json");
        return headers;
    },
});

interface LoginResponse {
    accessToken: string;
    mercureToken: string;
}

export const loginApi = createApi({
    reducerPath: "loginApi",
    baseQuery,
    endpoints: (build) => ({
        loginUser: build.mutation<LoginResponse, LoginByEmailProps>({
            query: (data: LoginByEmailProps) => ({
                url: AuthApiEndpoints.LOGIN,
                method: "POST",
                body: data,
            }),
        }),
    }),
});
