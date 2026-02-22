import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { CreateAdminJournal, GetAdminJournal, GetAdminJournalsParams, GetAdminJournalsResponse, UpdateAdminJournalParams } from "../model/types/adminJournalSchema";


export const adminJournalApi = createApi({
    reducerPath: "adminJournalApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["journal"],
    endpoints: (build) => ({
        getAdminJournalList: build.query<GetAdminJournalsResponse, Partial<GetAdminJournalsParams>>({
            query: () => ({
                url: "journal/list",
                method: "GET",
            }),
            providesTags: ["journal"],
        }),
        getAdminJournalById: build.query<GetAdminJournal, string>({
            query: (journalId) => ({
                url: `journal/element/${journalId}`,
                method: "GET",
            }),
            providesTags: ["journal"],
        }),
        createAdminJournal: build.mutation<void, CreateAdminJournal>({
            query: (body) => ({
                url: "journal/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["journal"],
        }),
        updateAdminJournal: build.mutation<void, UpdateAdminJournalParams>({
            query: ({ id, body }) => ({
                url: `journal/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["journal"],
        }),
        deleteAdminJournal: build.mutation<void, string>({
            query: (id) => ({
                url: `journal/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["journal"],
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
            providesTags: ["review"],
        }),
        updateAdminReviewNews: build.mutation<void, UpdateAdminReviewNewsParams>({
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
