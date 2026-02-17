import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import {
    GetNewsList, GetNewsListParams, GetNewsListResponse, GetNewsParams,
} from "../model/types/newsSchema";

export const newsApi = createApi({
    reducerPath: "newsApi",
    baseQuery: baseQueryV3,
    tagTypes: ["news"],
    endpoints: (build) => ({
        getNewsList: build.query<GetNewsListResponse, Partial<GetNewsListParams>>({
            query: () => ({
                url: "news/list",
                method: "GET",
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
    }),
});

export const {
    useLazyGetNewsListQuery,
    useGetNewsByIdQuery,
    usePutLikeNewsMutation,
} = newsApi;
