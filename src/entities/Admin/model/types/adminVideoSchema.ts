import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";
import { Image } from "@/types/media";
import { CategoryNews } from "@/types/categories";

export interface AdminVideoAuthorFileds {
    id: string;
    firstName: string | null;
    lastName: string | null;
}

export interface AdminVideoFileds {
    name: string;
    url: string;
    description: string;
    isActive: boolean;
    image: Image | null;
    categoryId: number;
    author: AdminVideoAuthorFileds | null;
}

export interface GetAdminVideosParams {
    sort: AdminSort;
    name: string;
    firstName: string;
    lastName: string;
    page: number;
    limit: number;
}

export interface GetAdminVideos {
    id: string;
    name: string;
    categoryName: string;
    isActive: boolean;
    created: string;
    reviewCount: number;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    }
}

export interface GetAdminVideosResponse {
    data: GetAdminVideos[];
    pagination: Pagination;
}

export type GetAdminVideo = Omit<GetAdminVideos, "categoryName"> & {
    url: string;
    description: string;
    image: Image;
    category: CategoryNews;
};

export type UpdateAdminVideo = Pick<GetAdminVideo, "name"
| "url" | "description" | "isActive"> & {
    imageId: string;
    categoryId: number;
    authorId: string;
};

export interface UpdateAdminVideoParams {
    id: string;
    body: UpdateAdminVideo
}

// Review

export interface GetAdminReviewsVideo {
    id: string;
    description: string;
    isActive: boolean;
    created: string;
    author: {
        id: string;
        firstName: string;
        lastName: string;
    };
    video: {
        name: string;
    }
}

export interface GetAdminReviewsVideoParams {
    sort: AdminSort;
    videoId: string;
    firstName: string;
    lastName: string;
    videoName: string;
    page: number;
    limit: number;
}

export interface GetAdminReviewsVideoResponse {
    data: GetAdminReviewsVideo[];
    pagination: Pagination;
}

export type GetAdminReviewVideo = Omit<GetAdminReviewsVideo, "video">;

export interface UpdateAdminReviewVideo {
    description: string;
    isActive: boolean;
}

export interface UpdateAdminReviewVideoParams {
    id: string;
    body: UpdateAdminReviewVideo;
}
