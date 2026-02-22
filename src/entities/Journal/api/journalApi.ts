import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import { CreateReviewJournal, GetJournal, GetJournalsParams, GetJournalsResponse, GetReviewsJournalParams, GetReviewsJournalResponse } from "../model/journalSchema";

export const journalApi = createApi({
    reducerPath: "journalApi",
    baseQuery: baseQueryV3,
    tagTypes: ["journal", "review"],
    endpoints: (build) => ({
        getJournalList: build.query<GetJournalsResponse, Partial<GetJournalsParams>>({
            query: (params) => ({
                url: "journal/list",
                method: "GET",
                params,
            }),
            providesTags: ["journal"],
        }),
        getJournalById: build.query<GetJournal, string>({
            query: (id) => ({
                url: `journal/element/${id}`,
                method: "GET",
            }),
            providesTags: ["journal"],
        }),
        putLikeJournal: build.mutation<void, string>({
            query: (id) => ({
                url: `journal/like/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["journal"],
        }),
        // Review
        getReviewsByJournalId: build.query<GetReviewsJournalResponse, GetReviewsJournalParams>({
            query: ({journalId, page, limit}) => ({
                url: `review-journal/list/${journalId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["journal", "review"],
        }),
        createReviewJournal: build.mutation<void, CreateReviewJournal>({
            query: (body) => ({
                url: "review-journal/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["journal", "review"],
        }),
    }),
});

export const {
    useLazyGetJournalListQuery,
    useGetJournalByIdQuery,
    usePutLikeJournalMutation,
} = journalApi;
