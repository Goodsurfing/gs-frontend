import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_PUBLIC_BASE_URL } from "@/shared/constants/api";
import { AuthApiEndpoints } from "@/types/api/auth";
import {
    IAuthLoginData,
    ILoginResponse,
} from "@/types/api/auth/login.interface";
import {
    IAuthFormData,
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
    baseQuery: fetchBaseQuery({ baseUrl: API_PUBLIC_BASE_URL }),
    endpoints: (build) => ({
        registerUser: build.mutation<IRegisterResponse, IAuthFormData>({
            query: (data: IAuthFormData) => ({
                url: AuthApiEndpoints.REGISTER,
                method: "POST",
                body: data,
            }),
        }),
        loginUser: build.mutation<ILoginResponse, IAuthLoginData>({
            query: (data: IAuthLoginData) => ({
                url: AuthApiEndpoints.LOGIN,
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
        }),
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
