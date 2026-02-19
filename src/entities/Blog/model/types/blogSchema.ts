// Blog Categories

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { Pagination } from "@/types/api/pagination";
import { Image } from "@/types/media";

export interface BlogCategory {
    id: number;
    name: string;
    color: string;
}

export interface GetBlogCategoriesParams {
    lang: Locale;
}

// Blog

export interface GetBlogList {
    id: number;
    name: string;
    description: string;
    created: string;
    isActive: boolean;
    reviewCount: number;
    likeCount: number;
    image: Image;
    blogCategory: BlogCategory;
}

export interface GetBlogListResponse {
    data: GetBlogList[];
    pagination: Pagination;
}

export interface GetBlogListParams {
    sort: AdminSort;
    lang: Locale;
    isAuth: boolean;
    name: string;
    blogCategoryId: number;
    page: number;
    limit: number;
}

export type GetBlog = Omit<GetBlogList, "blogCategory"> & {
    isHasLike: boolean;
    isGudserfing: boolean;
    blogCategoryResult: BlogCategory;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: Image | null;
    }
};

export interface GetBlogParams {
    id: number;
    lang: Locale;
}

export type CreateBlog = Pick<GetBlog, "name" | "description" | "isActive"> & {
    imageId: string;
    categoryId: number;
};

export interface UpdateBlogParams {
    id: number;
    body: CreateBlog;
}

// Review Blog

export interface GetReviewBlog {
    description: string;
    created: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: Image | null;
    }
}

export interface GetReviewsBlogParams {
    blogId: number;
    page: number;
    limit: number;
}

export interface GetReviewsBlogResponse {
    data: GetReviewBlog[];
    pagination: Pagination;
}

export interface CreateReviewBlog {
    blogId: number;
    description: string;
}
