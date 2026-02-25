import { getMediaContent } from "@/shared/lib/getMediaContent";
import {
    CreateVideo, GetReviewsVideo, GetVideos, VideoFields,
} from "../model/types/videoSchema";
import { VideoCardType } from "../ui/VideoCard/VideoCard";
import { Comments } from "@/features/Article";
import { getFullName } from "@/shared/lib/getFullName";

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

export const videoReviewsAdapter = (data: GetReviewsVideo[]): Comments[] => data.map((value) => {
    const { author, created, description } = value;
    return {
        authorId: author.id,
        authorAvatar: getMediaContent(author?.image?.contentUrl),
        authorName: getFullName(author.firstName, author.lastName),
        comment: description,
        date: created,
    };
});
