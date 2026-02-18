import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateReviewNewsRequest,
    GetNewsList, GetNewsListParams, GetNewsListResponse, GetNewsParams,
    GetReviewsNewsParams,
    GetReviewsNewsResponse,
} from "../model/types/newsSchema";

export const newsApi = createApi({
    reducerPath: "newsApi",
    baseQuery: baseQueryV3,
    tagTypes: ["news"],
    endpoints: (build) => ({
        getNewsList: build.query<GetNewsListResponse, Partial<GetNewsListParams>>({
            query: (params) => ({
                url: "news/list",
                method: "GET",
                params,
            }),
            providesTags: ["news"],
        }),
        getNewsById: build.query<GetNewsList, GetNewsParams>({
            query: ({ id, lang }) => ({
                url: `news/element/${id}`,
                method: "GET",
                params: { lang },
            }),
            providesTags: ["news"],
        }),
        putLikeNews: build.mutation<void, string>({
            query: (newsId) => ({
                url: `news/like/${newsId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["news"],
        }),
        // Review news
        getReviewsNews: build.query<GetReviewsNewsResponse, GetReviewsNewsParams>({
            query: ({ newsId, limit, page }) => ({
                url: `review-news/list/${newsId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["news"],
        }),
        createReviewNews: build.mutation<void, CreateReviewNewsRequest>({
            query: (body) => ({
                url: "review-news/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["news"],
        }),
    }),
});

export const {
    useLazyGetNewsListQuery,
    useGetNewsByIdQuery,
    usePutLikeNewsMutation,
    useLazyGetReviewsNewsQuery,
    useCreateReviewNewsMutation,
} = newsApi;
