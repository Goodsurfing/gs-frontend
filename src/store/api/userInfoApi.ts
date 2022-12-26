import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_USER_BASE_URL } from "@/constants/api";

import { IGenericUserDataResponse } from "@/store/api/api.types";
import { RootState } from "@/store/store";

export const userInfoApi = createApi({
    reducerPath: "userInfoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_USER_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).login;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => {
        return {
            getUserInfo: build.query<IGenericUserDataResponse, void>({
                query: () => {
                    return {
                        url: "/profile/",
                    };
                },
            }),
        };
    },
});
