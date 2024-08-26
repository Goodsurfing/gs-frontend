import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { ApplicationReview } from "../model/types/review";

interface ReviewRequest {
    reviewId: string;
    data: Partial<ApplicationReview>;
}

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["review"],
    endpoints: (build) => ({
        createVolunteerReview: build.mutation<ApplicationReview, Partial<ApplicationReview>>({
            query: (body) => ({
                url: "feedback_to_volunteers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["review"],
        }),
        getVolunteerReviewById: build.query<ApplicationReview, string>({
            query: (reviewId) => ({
                url: `feedback_to_volunteers/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        getVolunteerReviewsById: build.query<ApplicationReview[], string>({
            query: (volunteerId) => ({
                url: `volunteers/${volunteerId}/feedbacks`,
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        updateVolunteerReviewById: build.mutation<ApplicationReview, ReviewRequest>({
            query: ({ reviewId, data }) => ({
                url: `organizations/${reviewId}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["review"],
        }),
    }),
});

export const {
    useCreateVolunteerReviewMutation,
    useGetVolunteerReviewByIdQuery,
    useGetVolunteerReviewsByIdQuery,
    useUpdateVolunteerReviewByIdMutation,
} = reviewApi;
