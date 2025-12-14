import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    ApplicationReview, ApplicationReviewResponse,
    CreateOfferReview,
    CreateVolunteerReview,
    GetAboutVolunteerReviewParams, GetAboutVolunteerReviewRequest,
    GetOfferReviewParams,
    GetOfferReviewRequest,
} from "../model/types/review";
import { API_BASE_URL_V3 } from "@/shared/constants/api";

interface ReviewRequest {
    reviewId: string;
    data: Partial<ApplicationReview>;
}

interface ReviewParams {
    author?: string;
    volunteer?: string;
    organization?: string;
    itemsPerPage?: number;
    page?: number;
}

// interface ReviewHostRequest {
//     hostId: string;
//     itemsPerPage?: number;
//     page?: number;
// }

// interface ReviewVolunteerRequest {
//     volunteerId: string;
//     itemsPerPage?: number;
//     page?: number;
// }

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
        getToOrganizationsReviews: build.query<ApplicationReviewResponse[], ReviewParams>({
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
        // new review endpoints
        createVolunteerReview: build.mutation<void,
        CreateVolunteerReview>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}review-volunteer/create`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["volunteer"],
        }),
        getAboutVolunteerReviews: build.query<GetAboutVolunteerReviewRequest,
        GetAboutVolunteerReviewParams>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}review-volunteer/list`,
                method: "GET",
                params,
            }),
            providesTags: ["volunteer"],
        }),
        createOfferReview: build.mutation<void,
        CreateOfferReview>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}review-vacancy/create`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["host"],
        }),
        getOfferReviews: build.query<GetOfferReviewRequest,
        GetOfferReviewParams>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}review-vacancy/list`,
                method: "GET",
                params,
            }),
            providesTags: ["host"],
        }),
    }),
});

export const {
    useCreateToVolunteerReviewMutation,
    useGetToVolunteerReviewsQuery,
    useLazyGetToVolunteerReviewsQuery,
    useGetToVolunteerReviewByIdQuery,
    useLazyGetToVolunteerReviewByIdQuery,
    useUpdateToVolunteerReviewByIdMutation,
    useCreateToOrganizationsReviewMutation,
    useGetToOrganizationsReviewsQuery,
    useLazyGetToOrganizationsReviewsQuery,
    useGetToOrganizationsReviewByIdQuery,
    useLazyGetToOrganizationsReviewByIdQuery,
    useUpdateToOrganizationsReviewByIdMutation,
    useCreateVolunteerReviewMutation,
    useLazyGetAboutVolunteerReviewsQuery,
    useCreateOfferReviewMutation,
    useLazyGetOfferReviewsQuery,
} = reviewApi;
