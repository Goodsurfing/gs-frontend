import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { ApplicationReview, ApplicationReviewResponse } from "../model/types/review";

interface ReviewRequest {
    reviewId: string;
    data: Partial<ApplicationReview>;
}

interface ReviewParams {
    author: string;
    itemsPerPage?: number;
    page?: number;
}

interface ReviewHostRequest {
    hostId: string;
    itemsPerPage?: number;
    page?: number;
}

interface ReviewVolunteerRequest {
    volunteerId: string;
    itemsPerPage?: number;
    page?: number;
}

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["volunteer", "host"],
    endpoints: (build) => ({
        createToVolunteerReview: build.mutation<ApplicationReview,
        Omit<ApplicationReview, "id">>({
            query: (body) => ({
                url: "feedback_to_volunteers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["volunteer"],
        }),
        getToVolunteerReviews: build.query<ApplicationReviewResponse[], ReviewParams>({
            query: (params) => ({
                url: "feedback_to_volunteers",
                method: "GET",
                params,
            }),
            providesTags: ["volunteer"],
        }),
        getToVolunteerReviewById: build.query<ApplicationReviewResponse, string>({
            query: (reviewId) => ({
                url: `feedback_to_volunteers/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["volunteer"],
        }),
        getToVolunteerReviewsById: build.query<ApplicationReviewResponse[],
        ReviewVolunteerRequest>({
            query: ({ volunteerId, itemsPerPage, page }) => ({
                url: `volunteers/${volunteerId}/feedbacks`,
                method: "GET",
                params: { itemsPerPage, page },
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
        createToOrganizationsReview: build.mutation<ApplicationReview,
        Omit<ApplicationReview, "id">>({
            query: (body) => ({
                url: "feedback_to_organizations",
                method: "POST",
                body,
            }),
            invalidatesTags: ["host"],
        }),
        getToOrganizationsReviews: build.query<ApplicationReview[], ReviewParams>({
            query: (params) => ({
                url: "feedback_to_organizations",
                method: "GET",
                params,
            }),
            providesTags: ["host"],
        }),
        getToOrganizationsReviewById: build.query<ApplicationReview, string>({
            query: (reviewId) => ({
                url: `feedback_to_organizations/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        getToOrganizationsReviewsById: build.query<ApplicationReviewResponse[], ReviewHostRequest>({
            query: ({ hostId, itemsPerPage, page }) => ({
                url: `organizations/${hostId}/feedbacks`,
                method: "GET",
                params: { itemsPerPage, page },
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
    useGetToVolunteerReviewsQuery,
    useLazyGetToVolunteerReviewsQuery,
    useGetToVolunteerReviewByIdQuery,
    useLazyGetToVolunteerReviewByIdQuery,
    useGetToVolunteerReviewsByIdQuery,
    useLazyGetToVolunteerReviewsByIdQuery,
    useUpdateToVolunteerReviewByIdMutation,
    useCreateToOrganizationsReviewMutation,
    useGetToOrganizationsReviewsQuery,
    useLazyGetToOrganizationsReviewsQuery,
    useGetToOrganizationsReviewByIdQuery,
    useLazyGetToOrganizationsReviewByIdQuery,
    useGetToOrganizationsReviewsByIdQuery,
    useLazyGetToOrganizationsReviewsByIdQuery,
    useUpdateToOrganizationsReviewByIdMutation,
} = reviewApi;
