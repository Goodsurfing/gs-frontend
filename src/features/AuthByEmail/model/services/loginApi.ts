import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import { User } from "entities/User";

import { API_PUBLIC_BASE_URL } from "shared/constants/api";

import { LoginApiEndpoints } from "../types/loginSchema";

interface LoginByEmailData {
  email: string;
  password: string;
}

interface LoginByEmailResponse {
  token: string;
}

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_PUBLIC_BASE_URL }),
  endpoints: (build) => ({
    loginUser: build.mutation<LoginByEmailResponse, User>({
      query: (data: LoginByEmailData) => ({
        url: LoginApiEndpoints.LOGIN,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = loginApi;
