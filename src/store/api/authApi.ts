import { API_BASE_URL } from "@/constants/api";
import {
    AuthApiEndpoints,
    IAuthFormData,
    IAuthLoginData,
    ILoginResponse,
    IRegisterResponse,
    IResetPasswordRequestFormData,
    IResetPasswordRequestResponse,
    IResetPasswordVerifyData,
    IResetPasswordVerifyResponse,
} from "@/type/auth/auth.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
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
