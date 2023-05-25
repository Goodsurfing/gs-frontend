import { API_USER_BASE_URL } from "shared/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUserInfo } from "pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.interface";
import { RootState } from "store/store";

export const userInfoApi = createApi({
  reducerPath: "userInfoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_USER_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).login;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  tagTypes: ["userInfo"],
  endpoints: (build) => ({
    getUserInfo: build.query<IUserInfo, void>({
      query: () => ({
        url: "profile/",
      }),
      providesTags: ["userInfo"],
    }),
    putUserInfo: build.mutation<IUserInfo, Partial<IUserInfo>>({
      query: (data: Partial<IUserInfo>) => ({
        url: "profile/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["userInfo"],
    }),
  }),
});
