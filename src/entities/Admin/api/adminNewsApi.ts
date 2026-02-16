import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminNews, GetAdminNews, GetAdminNewsListParams, GetAdminNewsListResponse,
    UpdateAdminNewsParams,
} from "../model/types/adminNewsSchema";

export const adminNewsApi = createApi({
    reducerPath: "adminNewsApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["news"],
    endpoints: (build) => ({
        getAdminNewsList: build.query<GetAdminNewsListResponse, Partial<GetAdminNewsListParams>>({
            query: () => ({
                url: "news/list",
                method: "GET",
            }),
            providesTags: ["news"],
        }),
        getAdminNewsById: build.query<GetAdminNews, string>({
            query: (newsid) => ({
                url: `news/element/${newsid}`,
                method: "GET",
            }),
            providesTags: ["news"],
        }),
        createAdminNews: build.mutation<void, CreateAdminNews>({
            query: (body) => ({
                url: "news/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["news"],
        }),
        updateAdminNews: build.mutation<void, UpdateAdminNewsParams>({
            query: ({ id, body }) => ({
                url: `news/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["news"],
        }),
        deleteAdminNews: build.mutation<void, string>({
            query: (id) => ({
                url: `news/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["news"],
        }),
    }),
});

export const {
    useLazyGetAdminNewsListQuery,
    useGetAdminNewsByIdQuery,
    useCreateAdminNewsMutation,
    useUpdateAdminNewsMutation,
    useDeleteAdminNewsMutation,
} = adminNewsApi;
