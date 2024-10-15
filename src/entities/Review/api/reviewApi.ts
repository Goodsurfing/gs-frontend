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
    tagTypes: ["volunteer", "host"],
    endpoints: (build) => ({
        createToVolunteerReview: build.mutation<ApplicationReview, Partial<ApplicationReview>>({
            query: (body) => ({
                url: "feedback_to_volunteers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["volunteer"],
        }),
        getToVolunteerReviewById: build.query<ApplicationReview, string>({
            query: (reviewId) => ({
                url: `feedback_to_volunteers/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["volunteer"],
        }),
        getToVolunteerReviewsById: build.query<ApplicationReview[], string>({
            query: (volunteerId) => ({
                url: `volunteers/${volunteerId}/feedbacks`,
                method: "GET",
            }),
            providesTags: ["volunteer"],
        }),
        updateToVolunteerReviewById: build.mutation<ApplicationReview, ReviewRequest>({
            query: ({ reviewId, data }) => ({
                url: `organizations/${reviewId}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["volunteer"],
        }),
        createToOrganizationsReview: build.mutation<ApplicationReview, Partial<ApplicationReview>>({
            query: (body) => ({
                url: "feedback_to_organizations",
                method: "POST",
                body,
            }),
            invalidatesTags: ["host"],
        }),
        getToOrganizationsReviewById: build.query<ApplicationReview, string>({
            query: (reviewId) => ({
                url: `feedback_to_organizations/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        getToOrganizationsReviewsById: build.query<ApplicationReview[], string>({
            query: (hostId) => ({
                url: `organizations/${hostId}/feedbacks`,
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        updateToOrganizationsReviewById: build.mutation<ApplicationReview, ReviewRequest>({
            query: ({ reviewId, data }) => ({
                url: `organizations/${reviewId}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify(data),
            }),
            invalidatesTags: ["host"],
        }),
    }),
});

export const {
    useCreateToVolunteerReviewMutation,
    useGetToVolunteerReviewByIdQuery,
    useLazyGetToVolunteerReviewByIdQuery,
    useGetToVolunteerReviewsByIdQuery,
    useUpdateToVolunteerReviewByIdMutation,
} = reviewApi;
