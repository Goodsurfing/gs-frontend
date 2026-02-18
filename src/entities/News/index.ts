export {
    newsApi,
    useLazyGetNewsListQuery,
    useGetNewsByIdQuery,
    usePutLikeNewsMutation,
    useLazyGetReviewsNewsQuery,
    useCreateReviewNewsMutation,
} from "./api/newsApi";

export type { GetNewsList, GetReviewsNews } from "./model/types/newsSchema";

export { newsReviewsAdapter, newsArticleCardAdapter } from "./lib/newsAdapter";
