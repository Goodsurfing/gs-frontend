export type {
    CreateVideo, GetVideo, GetVideos, CreateReviewVideo,
    GetReviewsVideo, VideoFields,
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

export { videoApiAdapter, videoCardAdapter } from "./lib/videoAdapter";

export { VideoCard } from "./ui/VideoCard/VideoCard";
export type { VideoCardType } from "./ui/VideoCard/VideoCard";
