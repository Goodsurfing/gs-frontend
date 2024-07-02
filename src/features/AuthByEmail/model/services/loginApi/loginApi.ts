import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "@/shared/constants/api";
import { AuthApiEndpoints } from "@/types/api/auth";
import { LoginByEmailProps } from "../../types/login";

interface LoginResponse {
    token: string;
}

export const loginApi = createApi({
    reducerPath: "loginApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (build) => ({
        loginUser: build.mutation<LoginResponse, LoginByEmailProps>({
            query: (data: LoginByEmailProps) => ({
                url: AuthApiEndpoints.LOGIN,
                method: "POST",
                body: data,
                headers: {
                    accept: "application/json",
                    "Content-type": "application/json",
                },
            }),
        }),
    }),
});
