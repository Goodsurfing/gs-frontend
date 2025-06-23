import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/shared/constants/api";
import { AuthApiEndpoints } from "@/types/api/auth";
import {
    LoginByEmailProps,
    LoginResponse,
} from "@/types/api/auth/login.interface";
import {
    IRegisterFormData,
    IRegisterResponse,
} from "@/types/api/auth/register.interface";
import {
    IResetPasswordRequestFormData,
    IResetPasswordRequestResponse,
    IResetPasswordVerifyData,
    IResetPasswordVerifyResponse,
} from "@/types/api/auth/resetPassword.interface";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json");
            headers.set("accept", "application/json");
            return headers;
        },
    }),
    endpoints: (build) => ({
        loginUser: build.mutation<LoginResponse, LoginByEmailProps>({
            query: (data: LoginByEmailProps) => ({
                url: AuthApiEndpoints.LOGIN,
                method: "POST",
                body: data,
            }),
        }),
        registerUser: build.mutation<IRegisterResponse, IRegisterFormData>({
            query: (data) => ({
                url: AuthApiEndpoints.REGISTER,
                method: "POST",
                body: data,
            }),
        }),
        resetPasswordRequest: build.mutation<
        IResetPasswordRequestResponse,
        IResetPasswordRequestFormData
        >({
            query: (data: IResetPasswordRequestFormData) => ({
                url: AuthApiEndpoints.RESET_PASSWORD_REQUEST,
                method: "POST",
                body: data,
            }),
        }), // Reset password issue in backend
        resetPasswordVerify: build.mutation<
        IResetPasswordVerifyResponse,
        IResetPasswordVerifyData
        >({
            query: (data: IResetPasswordVerifyData) => ({
                url: AuthApiEndpoints.RESET_PASSWORD,
                method: "POST",
                body: data,
            }),
        }),
    }),
});
