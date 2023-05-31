import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "app/providers/StoreProvider";

import { API_TRANSLATION_BASE_URL } from "shared/constants/api";

import { ChangeLocaleBody } from "../../types/languages";

export const localeApi = createApi({
  reducerPath: "localeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_TRANSLATION_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    changeLocale: build.mutation<unknown, ChangeLocaleBody>({
      query: (data: ChangeLocaleBody) => ({
        url: "set-locale",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useChangeLocaleMutation } = localeApi;
