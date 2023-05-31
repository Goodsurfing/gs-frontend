import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

// eslint-disable-next-line import/no-cycle
import { RootState } from "store/store";

import { API_TRANSLATION_BASE_URL } from "shared/constants/api";
import { IChangeLocaleBody } from "shared/types/api/locales/index";

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
