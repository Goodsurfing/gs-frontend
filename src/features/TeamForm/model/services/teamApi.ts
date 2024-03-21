import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

import { API_ORGANIZATIONS_BASE_URL } from "@/shared/constants/api";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

const teamApi = createApi({
    reducerPath: "teamApi",
    baseQuery: fetchBaseQuery({
        credentials: "same-origin",
        baseUrl: API_ORGANIZATIONS_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
            if (token) {
                headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
            }
            headers.set("Access-Control-Allow-Origin", "*");
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    tagTypes: ["users"],
    endpoints: (build) => ({
        getUserOrganizationList: build.query({
            query: (data) => ({
                url: `organization/${data.uuid}/users`,
            }),
            providesTags: ["users"],
        }),
        addUser: build.mutation({
            query: (data) => ({
                url: `organization/${data.uuid}/users`,
                method: "POST",
                body: data.id,
            }),
            invalidatesTags: ["users"],
        }),
        removeUser: build.mutation({
            query: (data) => ({
                url: `organization/${data.uuid}/users`,
                method: "DELETE",
                body: data.id,
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const {
    useGetUserOrganizationListQuery,
    useAddUserMutation,
    useRemoveUserMutation,
} = teamApi;
