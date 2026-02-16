import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { Pagination } from "@/types/api/pagination";
import { CategoryNews } from "@/types/categories";
import { Image } from "@/types/media";

export interface GetNewsListParams {
    sort: AdminSort;
    lang: Locale;
    name: string;
    categoryId: number;
    page: number;
    limit: number;
}

export interface GetNewsList {
    id: string;
    name: string;
    description: string;
    created: string;
    reviewCount: number;
    likeCount: number;
    image: Image;
    category: CategoryNews;
}

export interface GetNewsListResponse {
    data: GetNewsList[];
    pagination: Pagination;
}

export type GetNews = GetNewsList & {
    author: {
        id: string;
        firsName: string | null;
        lastName: string | null;
        image: Image | null;
    }
};

export interface GetNewsParams {
    id: string;
    lang: Locale;
}
