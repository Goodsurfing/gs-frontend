import { API_USER_BASE_URL } from "@/constants/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IGenericUserDataResponse } from "@/store/api/api.types";
import { RootState } from "@/store/store";

export const userInfoApi = createApi({
    reducerPath: "userInfoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_USER_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).login.token;
            console.log(token);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => ({
        getUserInfo: build.query<IGenericUserDataResponse, void>({
            query: () => ({
                url: "/profile/",
            }),
        }),
    }),
});
