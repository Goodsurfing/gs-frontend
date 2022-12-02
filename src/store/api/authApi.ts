import { AuthApiEndpoints, IAuthFormData } from "@/type/auth/auth.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IGenericResponse } from "@/store/api/api.types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.BACKEND_BASE_URL }),
    endpoints: (build) => ({
        registerUser: build.mutation<IGenericResponse, IAuthFormData>({
            query: (data) => ({
                url: AuthApiEndpoints.REGISTER,
                method: "POST",
                body: data,
            }),
        }),
    }),
});
