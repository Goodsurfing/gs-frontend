import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_TRANSLATION_BASE_URL } from "@/constants/api";
import { IChangeLocaleBody } from "@/type/languages";

export const localeApi = createApi({
    reducerPath: "localeApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_TRANSLATION_BASE_URL }),
    endpoints: (build) => {
        return {
            changeLocale: build.mutation<unknown, IChangeLocaleBody>({
                query: (data: IChangeLocaleBody) => {
                    return {
                        url: "/set-locale",
                        method: "PUT",
                        body: data,
                    };
                },
            }),
        };
    },
});
