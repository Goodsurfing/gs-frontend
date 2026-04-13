import { Image } from "@/types/media";
import { AdminSort } from "./adminSchema";
import { Pagination } from "@/types/api/pagination";

export const enum BannerMarketingType {
    UNDER_HEADER_ALL_PAGES = "UNDER_HEADER_ALL_PAGES",
    VACANCY_PAGE = "VACANCY_PAGE",
    MAIN_PAGE = "MAIN_PAGE",
}

export interface GetBannerMarketingParams {
    type: BannerMarketingType;
}

export interface BannerMarketingElement {
    url: string;
    description: string;
    image: Image;
}

export interface GetAdminBannerMarketingListParams {
    sort: AdminSort;
    page: number;
    limit: number;
}

export interface GetAdminBannerMarketingList {
    id: string;
    name: string;
    url: string;
    description: string;
    isActive: boolean;
    type: BannerMarketingType;
}

export interface GetAdminBannerMarketingListResponse {
    data: GetAdminBannerMarketingList[];
    pagination: Pagination;
}

export type GetAdminMarketingBanner = GetAdminBannerMarketingList & {
    image: Image;
};

export type CreateAdminBannerMarketing = Omit<GetAdminBannerMarketingList, "id"> & {
    imageId: string;
};

export interface UpdateAdminBannerMarketingParams {
    id: string;
    body: CreateAdminBannerMarketing;
}
