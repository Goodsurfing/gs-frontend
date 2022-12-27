import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_USER_BASE_URL } from "@/constants/api";

import { RootState } from "@/store/store";
import { IUserInfo } from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.interface";

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
            getUserInfo: build.query<IUserInfo, void>({
                query: () => {
                    return {
                        url: "/profile/",
                    };
                },
            }),
            putUserInfo: build.mutation<IUserInfo, Partial<IUserInfo>>({
                query: (data: Partial<IUserInfo>) => {
                    return {
                        url: "/profile/",
                        method: "PUT",
                        body: data,
                    };
                },
            }),
        };
    },
});
