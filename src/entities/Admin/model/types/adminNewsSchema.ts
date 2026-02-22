import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";
import { Image } from "@/types/media";
import { CategoryNews } from "@/types/categories";

export interface GetAdminNewsList {
    id: string;
    name: string;
    categoryName: string;
    isActive: boolean;
    created: string;
    reviewCount: number;
    author: {
        id: string;
        firstName: string;
        lastName: string;
    }
}

export interface GetAdminNewsListResponse {
    data: GetAdminNewsList[];
    pagination: Pagination;
}

export interface GetAdminNewsListParams {
    sort: AdminSort;
    name: string;
    firstName: string;
    lastName: string;
    page: number;
    limit: number;
}

export type GetAdminNews = Omit<GetAdminNewsList, "categoryName"> & {
    description: string;
    image: Image;
    category: CategoryNews
};

export type CreateAdminNews = Omit<GetAdminNews, "id" | "categoryName"
| "created" | "reviewCount" | "author" | "category" | "image"> & {
    imageId: string;
    categoryId: number;
    authorId: string;
};

export interface UpdateAdminNewsParams {
    id: string;
    body: CreateAdminNews;
}

// Review News

export interface GetAdminReviewsNews {
    id: string;
    description: string;
    created: string;
    author: {
        id: string;
        firstName: string;
        lastName: string;
    }
    news: {
        name: string;
    }
    isActive: boolean;
}

export interface GetAdminReviewsNewsResponse {
    data: GetAdminReviewsNews[];
    pagination: Pagination;
}

export interface GetAdminReviewsNewsParams {
    sort: AdminSort;
    newsId: string;
    firstName: string;
    lastName: string;
    newsName: string;
    page: number;
    limit: number;
}

export type GetAdminReviewNews = Omit<GetAdminReviewsNews, "news">;

export type UpdateAdminReviewNews = Pick<GetAdminReviewNews, "description" | "isActive">;

export interface UpdateAdminReviewNewsParams {
    id: string;
    body: UpdateAdminReviewNews;
}
