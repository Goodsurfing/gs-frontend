import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_USER_BASE_URL } from "@/shared/constants/api";
import { IUserInfo } from "@/pages/ProfileInfoPage/ui/ProfileInfoForm/ProfileInfoForm.interface";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

export const userInfoApi = createApi({
    reducerPath: "userInfoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_USER_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
            if (token) {
                headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
            }
            headers.set("Content-Type", "application/json");

            return headers;
        },
    }),
    tagTypes: ["userInfo"],
    endpoints: (build) => ({
        getUserInfo: build.query<IUserInfo, void>({
            query: () => ({
                url: "/profile/",
            }),
            providesTags: ["userInfo"],
        }),
        putUserInfo: build.mutation<IUserInfo, Partial<IUserInfo>>({
            query: (data: Partial<IUserInfo>) => ({
                url: "/profile/",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["userInfo"],
        }),
    }),
});
