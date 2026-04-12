import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { CreateAdminSystem, GetAdminSystemListParams, GetAdminSystemListResponse } from "../model/types/adminSystemSchema";

export const adminSystemApi = createApi({
    reducerPath: "adminSystemApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["admin"],
    endpoints: (build) => ({
        getSystemAdminList: build.query<GetAdminSystemListResponse,
        Partial<GetAdminSystemListParams>>({
            query: (params) => ({
                url: "system-admin/list",
                method: "GET",
                params,
            }),
            providesTags: ["admin"],
        }),
        createSystemAdmin: build.mutation<void, CreateAdminSystem>({
            query: (body) => ({
                url: "system-admin/add-role",
                method: "POST",
                body,
            }),
            invalidatesTags: ["admin"],
        }),
        deleteSystemAdmin: build.mutation<void, string>({
            query: (id) => ({
                url: `system-admin/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["admin"],
        }),
    }),
});

export const {
    useGetSystemAdminListQuery,
    useLazyGetSystemAdminListQuery, useCreateSystemAdminMutation,
    useDeleteSystemAdminMutation,
} = adminSystemApi;
