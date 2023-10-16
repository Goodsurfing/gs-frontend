import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import type { RootState } from "@/store/store";

import { API_ORGANIZATIONS_BASE_URL } from "@/shared/constants/api";

const teamApi = createApi({
    reducerPath: "teamApi",
    baseQuery: fetchBaseQuery({
        credentials: "same-origin",
        baseUrl: API_ORGANIZATIONS_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).login;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
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
