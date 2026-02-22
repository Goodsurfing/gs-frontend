import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";
import { Image } from "@/types/media";
import { BlogCategory } from "@/entities/Blog";

export interface GetAdminBlogList {
    id: number;
    name: string;
    created: string;
    isActive: boolean;
    reviewCount: number;
    categoryName: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    } | null;
}

export interface GetAdminBlogListResponse {
    data: GetAdminBlogList[];
    pagination: Pagination;
}

export interface GetAdminBlogListParams {
    sort: AdminSort;
    name: string;
    firstName: string;
    lastName: string;
    page: number;
    limit: number;
}

export type GetAdminBlog = Omit<GetAdminBlogList, "categoryName"> & {
    description: string;
    isGudserfing: boolean;
    image: Image;
    category: BlogCategory;
};

export type UpdateAdminBlog = Pick<GetAdminBlog, "name" | "description" | "isActive"> & {
    blogCategoryId: number;
    imageId: string;
    authorId: string;
};

export interface UpdateAdminBlogParams {
    id: number;
    body: UpdateAdminBlog;
}

// Blog Category

export interface GetAdminBlogCategory {
    id: number;
    name: string;
    nameEn: string;
    nameEs: string;
    color: string;
}

export interface GetAdminBlogCategoriesResponse {
    data: GetAdminBlogCategory[];
    pagination: Pagination;
}

export interface GetAdminBlogCategoriesParams {
    page: number;
    limit: number;
}

export type CreateBlogCategory = Omit<GetAdminBlogCategory, "id">;

export interface UpdateBlogCategoryParams {
    id: number;
    body: CreateBlogCategory;
}

// Review Blog

export interface GetAdminReviewsBlog {
    id: number;
    description: string;
    isActive: boolean;
    created: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    }
    blog: {
        name: string;
    };
}

export interface GetAdminReviewsBlogResponse {
    data: GetAdminReviewsBlog[];
    pagination: Pagination;
}

export interface GetAdminReviewBlogParams {
    sort: AdminSort;
    blogId: number;
    firstName: string;
    lastName: string;
    blogName: string;
    page: number;
    limit: number;
}

export type GetAdminReviewBlog = Omit<GetAdminReviewsBlog, "blog">;

export type UpdateAdminReviewBlog = Pick<GetAdminReviewBlog, "description" | "isActive">;

export interface UpdateAdminReviewBlogParams {
    id: number;
    body: UpdateAdminReviewBlog;
}
