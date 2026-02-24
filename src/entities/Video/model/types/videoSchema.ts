import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { Pagination } from "@/types/api/pagination";
import { CategoryNews } from "@/types/categories";
import { Image } from "@/types/media";

export interface GetVideos {
    id: string;
    name: string;
    description: string;
    created: string;
    isActive: boolean;
    reviewCount: number;
    likeCount: number;
    image: Image;
    category: CategoryNews;
}

export interface GetVideosParams {
    sort: AdminSort;
    lang: Locale;
    isAuth: boolean;
    name: string;
    categoryId: number;
    page: number;
    limit: number;
}

export interface GetVideosResponse {
    data: GetVideos[];
    pagination: Pagination;
}

export interface GetVideoParams {
    id: string;
    lang: Locale;
}

export type GetVideo = Omit<GetVideos, "category"> & {
    url: string;
    isHasLike: boolean;
    categoryResult: CategoryNews;
    author: {
        id: string;
        firsName: string;
        lastName: string;
        image: Image;
    }
};

export type CreateVideo = Pick<GetVideo, "name" | "description"
| "url" | "isActive"> & {
    imageId: string;
    categoryId: number;
};

export interface UpdateVideoParams {
    id: string;
    body: CreateVideo;
}

// Review

export interface GetReviewsVideo {
    id: string;
    description: string;
    created: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: Image | null;
    }
}

export interface GetReviewsVideoParams {
    videoId: string;
    page: number;
    limit: number;
}

export interface GetReviewsVideoResponse {
    data: GetReviewsVideo[];
    pagination: Pagination;
}

export interface CreateReviewVideo {
    description: string;
    videoId: string;
}
