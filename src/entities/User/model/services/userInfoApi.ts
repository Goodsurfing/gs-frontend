import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import type { RootState } from "app/providers/StoreProvider";

import { API_USER_BASE_URL } from "shared/constants/api";

export const userInfoApi = createApi({
  reducerPath: "userInfoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_USER_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).user.authData;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  tagTypes: ["userInfo"],
  endpoints: (build) => ({
    getUserInfo: build.query({
      query: () => ({
        url: "profile/",
      }),
      providesTags: ["userInfo"],
    }),
    updateUserInfo: build.mutation({
      query: (data) => ({
        url: "profile/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["userInfo"],
    }),
  }),
});
