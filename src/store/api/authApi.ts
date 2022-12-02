import { API_BASE_URL } from "@/constants/api";
import {
    AuthApiEndpoints,
    IAuthFormData,
    IRegisterResponse,
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
    }),
});
