import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_TRANSLATION_BASE_URL } from "@/shared/constants/api";

import { IChangeLocaleBody } from "@/types/api/locales/index";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

export const localeApi = createApi({
    reducerPath: "localeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_TRANSLATION_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);

            if (token) {
                headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => ({
        changeLocale: build.mutation<unknown, IChangeLocaleBody>({
            query: (data: IChangeLocaleBody) => ({
                url: "/set-locale",
                method: "PUT",
                body: data,
            }),
        }),
    }),
});
