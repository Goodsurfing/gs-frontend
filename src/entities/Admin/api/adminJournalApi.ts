import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminJournal, GetAdminJournal, GetAdminJournalsParams,
    GetAdminJournalsResponse, GetAdminReviewJournal, GetAdminReviewsJournalParams,
    GetAdminReviewsJournalResponse, UpdateAdminJournalParams,
    UpdateAdminReviewJournalParams,
} from "../model/types/adminJournalSchema";

export const adminJournalApi = createApi({
    reducerPath: "adminJournalApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["journal", "review"],
    endpoints: (build) => ({
        getAdminJournalList: build.query<GetAdminJournalsResponse,
        Partial<GetAdminJournalsParams>>({
            query: (params) => ({
                url: "journal/list",
                method: "GET",
                params,
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
        getAdminReviewsJournal: build.query<GetAdminReviewsJournalResponse,
        Partial<GetAdminReviewsJournalParams>>({
            query: (params) => ({
                url: "review-journal/list",
                method: "GET",
                params,
            }),
            providesTags: ["review"],
        }),
        getAdminReviewJournalById: build.query<GetAdminReviewJournal, string>({
            query: (reviewId) => ({
                url: `review-journal/element/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        updateAdminReviewJournal: build.mutation<void, UpdateAdminReviewJournalParams>({
            query: ({ id, body }) => ({
                url: `review-journal/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["review"],
        }),
        deleteAdminReviewJournal: build.mutation<void, string>({
            query: (id) => ({
                url: `review-journal/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["review"],
        }),
    }),
});

export const {
    useLazyGetAdminJournalListQuery,
    useGetAdminJournalByIdQuery,
    useCreateAdminJournalMutation,
    useUpdateAdminJournalMutation,
    useDeleteAdminJournalMutation,
    useLazyGetAdminReviewsJournalQuery,
    useGetAdminReviewJournalByIdQuery,
    useUpdateAdminReviewJournalMutation,
    useDeleteAdminReviewJournalMutation,
} = adminJournalApi;
