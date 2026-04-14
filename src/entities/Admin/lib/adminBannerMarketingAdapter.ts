import {
    AdminBannerMarketingFileds, CreateAdminBannerMarketing,
    GetAdminBannerMarketingList, GetAdminMarketingBanner,
} from "../model/types/adminBannerMarketingSchema";

export const adminBannerMarketingListAdapter = (data: GetAdminBannerMarketingList[]) => data.map(
    (item) => {
        const {
            id, description, url, isActive, type,
        } = item;
        return {
            id,
            description,
            url,
            isActive,
            type,
        };
    },
);

export const adminBannerMarketingApiAdapter = (
    data: AdminBannerMarketingFileds,
): CreateAdminBannerMarketing => {
    const {
        description, image, isActive, type, url,
    } = data;

    return {
        description,
        imageId: image.id,
        isActive,
        type,
        url,
    };
};

export const adminBannerMarketingAdapter = (
    data: GetAdminMarketingBanner,
): AdminBannerMarketingFileds => {
    const {
        description, image, isActive, type, url,
    } = data;

    return {
        description,
        image,
        isActive,
        type,
        url,
    };
};
