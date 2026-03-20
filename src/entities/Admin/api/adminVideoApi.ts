import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    GetAdminReviewsVideoParams,
    GetAdminReviewsVideoResponse,
    GetAdminReviewVideo,
    GetAdminVideo, GetAdminVideosParams, GetAdminVideosResponse,
    UpdateAdminReviewVideoParams, UpdateAdminVideo, UpdateAdminVideoParams,
} from "../model/types/adminVideoSchema";

export const adminVideoApi = createApi({
    reducerPath: "adminVideoApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["video", "review"],
    endpoints: (build) => ({
        getAdminVideoList: build.query<GetAdminVideosResponse, Partial<GetAdminVideosParams>>({
            query: (params) => ({
                url: "video/list",
                method: "GET",
                params,
            }),
            providesTags: ["video"],
        }),
        getAdminVideoById: build.query<GetAdminVideo, string>({
            query: (id) => ({
                url: `video/element/${id}`,
                method: "GET",
            }),
            providesTags: ["video"],
        }),
        createAdminVideo: build.mutation<void, UpdateAdminVideo>({
            query: (body) => ({
                url: "video/video",
                method: "POST",
                body,
            }),
            invalidatesTags: ["video"],
        }),
        updateAdminVideo: build.mutation<void, UpdateAdminVideoParams>({
            query: ({ id, body }) => ({
                url: `video/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["video"],
        }),
        deleteAdminVideo: build.mutation<void, string>({
            query: (id) => ({
                url: `video/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["video"],
        }),
        // Review
        getAdminReviewsVideo: build.query<GetAdminReviewsVideoResponse,
        Partial<GetAdminReviewsVideoParams>>({
            query: (params) => ({
                url: "review-video/list",
                method: "GET",
                params,
            }),
            providesTags: ["review"],
        }),
        getAdminReviewVideoById: build.query<GetAdminReviewVideo,
        string>({
            query: (id) => ({
                url: `review-video/element/${id}`,
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        updateAdminReviewVideo: build.mutation<void, UpdateAdminReviewVideoParams>({
            query: ({ id, body }) => ({
                url: `review-video/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["video", "review"],
        }),
        deleteAdminReviewVideo: build.mutation<void, string>({
            query: (id) => ({
                url: `review-video/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["video", "review"],
        }),
    }),
});

export const {
    useLazyGetAdminVideoListQuery,
    useLazyGetAdminVideoByIdQuery,
    useCreateAdminVideoMutation,
    useGetAdminVideoByIdQuery,
    useUpdateAdminVideoMutation,
    useDeleteAdminVideoMutation,
    useLazyGetAdminReviewsVideoQuery,
    useGetAdminReviewVideoByIdQuery,
    useUpdateAdminReviewVideoMutation,
    useDeleteAdminReviewVideoMutation,
} = adminVideoApi;
