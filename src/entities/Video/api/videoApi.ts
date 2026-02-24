import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateReviewVideo,
    CreateVideo,
    GetReviewsVideoParams,
    GetReviewsVideoResponse,
    GetVideo, GetVideoParams, GetVideosParams, GetVideosResponse,
    UpdateVideoParams,
} from "../model/types/videoSchema";

export const videoApi = createApi({
    reducerPath: "videoApi",
    baseQuery: baseQueryV3,
    tagTypes: ["video", "review"],
    endpoints: (build) => ({
        getVideoList: build.query<GetVideosResponse, Partial<GetVideosParams>>({
            query: (params) => ({
                url: "video/list",
                method: "GET",
                params,
            }),
            providesTags: ["video"],
        }),
        getVideoById: build.query<GetVideo, GetVideoParams>({
            query: ({ id, lang }) => ({
                url: `video/element/${id}`,
                method: "GET",
                params: { lang },
            }),
            providesTags: ["video"],
        }),
        createVideo: build.mutation<void, CreateVideo>({
            query: (body) => ({
                url: "video/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["video"],
        }),
        updateVideo: build.mutation<void, UpdateVideoParams>({
            query: ({ id, body }) => ({
                url: `video/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["video"],
        }),
        deleteVideo: build.mutation<void, string>({
            query: (id) => ({
                url: `video/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["video"],
        }),
        putLikeVideo: build.mutation<void, string>({
            query: (videoId) => ({
                url: `video/like/${videoId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["video"],
        }),
        // Review
        getReviewsVideo: build.query<GetReviewsVideoResponse, GetReviewsVideoParams>({
            query: ({ videoId, limit, page }) => ({
                url: `review-video/list/${videoId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["review"],
        }),
        createReviewVideo: build.mutation<void, CreateReviewVideo>({
            query: (body) => ({
                url: "review-video/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["video", "review"],
        }),
    }),
});

export const {
    useLazyGetVideoListQuery,
    useGetVideoByIdQuery,
    useCreateVideoMutation,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
    usePutLikeVideoMutation,
    useLazyGetReviewsVideoQuery,
    useCreateReviewVideoMutation,
} = videoApi;
