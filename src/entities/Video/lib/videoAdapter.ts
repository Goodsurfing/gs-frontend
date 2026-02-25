import { getMediaContent } from "@/shared/lib/getMediaContent";
import { CreateVideo, GetVideos, VideoFields } from "../model/types/videoSchema";
import { VideoCardType } from "../ui/VideoCard/VideoCard";

export const videoApiAdapter = (video: VideoFields): CreateVideo => {
    const {
        name, description, url, categoryId,
        image,
    } = video;

    return {
        name,
        description,
        url,
        categoryId,
        imageId: image?.id ?? "",
        isActive: true,
    };
};

export const videoCardAdapter = (video: GetVideos[]): VideoCardType[] => video.map((item) => {
    const {
        id, name, description, image, category, created,
        likeCount, reviewCount,
    } = item;
    return {
        id,
        title: name,
        description,
        image: getMediaContent(image?.thumbnails?.large),
        date: created,
        comments: reviewCount,
        likes: likeCount,
        tag: { name: category?.name ?? "", color: category?.color ?? "var(--text-primary-1" },
    };
});
