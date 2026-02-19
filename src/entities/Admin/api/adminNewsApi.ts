import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminNews, GetAdminNews, GetAdminNewsListParams, GetAdminNewsListResponse,
    GetAdminReviewNews,
    GetAdminReviewsNewsParams,
    GetAdminReviewsNewsResponse,
    UpdateAdminNewsParams,
} from "../model/types/adminNewsSchema";

export const adminNewsApi = createApi({
    reducerPath: "adminNewsApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["news", "review"],
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
        // Review News
        getAdminReviewsNews: build.query<GetAdminReviewsNewsResponse,
        Partial<GetAdminReviewsNewsParams>>({
            query: () => ({
                url: "review-news/list",
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        getAdminReviewNewsById: build.query<GetAdminReviewNews, string>({
            query: (reviewId) => ({
                url: `review-news/element/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["news"],
        }),
        updateAdminReviewNews: build.mutation<void, UpdateAdminNewsParams>({
            query: ({ id, body }) => ({
                url: `review-news/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["review"],
        }),
        deleteAdminReviewNews: build.mutation<void, string>({
            query: (id) => ({
                url: `review-news/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["review"],
        }),
    }),
});

export const {
    useLazyGetAdminNewsListQuery,
    useGetAdminNewsByIdQuery,
    useCreateAdminNewsMutation,
    useUpdateAdminNewsMutation,
    useDeleteAdminNewsMutation,
    useLazyGetAdminReviewsNewsQuery,
    useGetAdminReviewNewsByIdQuery,
    useUpdateAdminReviewNewsMutation,
    useDeleteAdminReviewNewsMutation,
} = adminNewsApi;
