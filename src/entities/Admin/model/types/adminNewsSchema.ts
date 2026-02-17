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
| "created" | "reviewCount" | "author" | "category"> & {
    imageId: string;
    categoryId: number;
    authorId: string;
};

export interface UpdateAdminNewsParams {
    id: string;
    body: CreateAdminNews;
}
