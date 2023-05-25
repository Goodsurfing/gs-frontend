import { API_TRANSLATION_BASE_URL } from "shared/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import { RootState } from "store/store";

import { IChangeLocaleBody } from "types/api/locales/index";

export const localeApi = createApi({
  reducerPath: "localeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_TRANSLATION_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).login;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    changeLocale: build.mutation<unknown, IChangeLocaleBody>({
      query: (data: IChangeLocaleBody) => ({
        url: "set-locale",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});
