import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { Locale } from "../model/types/locale";

interface LocaleRequestData {
    locale: Locale;
}

export const localeApi = createApi({
    reducerPath: "localeApi",
    baseQuery,
    endpoints: (build) => ({
        changeLocale: build.mutation<unknown, LocaleRequestData>({
            query: (data: LocaleRequestData) => ({
                url: "/translation/set-locale",
                method: "PUT",
                body: data,
            }),
        }),
    }),
});
