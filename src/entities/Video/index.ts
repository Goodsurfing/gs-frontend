export type {
    CreateVideo, GetVideo, GetVideos, CreateReviewVideo,
    GetReviewsVideo,
} from "./model/types/videoSchema";

export {
    videoApi,
    useLazyGetVideoListQuery,
    useGetVideoByIdQuery,
    useCreateVideoMutation,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
    usePutLikeVideoMutation,
    useLazyGetReviewsVideoQuery,
    useCreateReviewVideoMutation,
} from "./api/videoApi";
