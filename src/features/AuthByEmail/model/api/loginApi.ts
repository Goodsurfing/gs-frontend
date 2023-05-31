import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import { API_PUBLIC_BASE_URL } from "shared/constants/api";

import { LoginApiEndpoints } from "../types/api";

interface LoginByEmailResponse {
  token: string;
}

interface LoginByEmailProps {
  email: string;
  password: string;
}

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_PUBLIC_BASE_URL }),
  endpoints: (build) => ({
    loginUser: build.mutation<LoginByEmailResponse, LoginByEmailProps>({
      query: (data: LoginByEmailProps) => ({
        url: LoginApiEndpoints.LOGIN,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = loginApi;
