import { API_BASE_URL } from "@/constants/api";
import {
    AuthApiEndpoints,
    IAuthFormData,
    IAuthLoginData,
    ILoginResponse,
    IRegisterResponse,
    IResetPasswordRequestFormData,
    IResetPasswordRequestResponse,
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
    }),
});
