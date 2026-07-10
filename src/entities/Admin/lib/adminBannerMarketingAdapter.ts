import {
    AdminBannerMarketingFileds, CreateAdminBannerMarketing,
    GetAdminBannerMarketingList, GetAdminMarketingBanner,
} from "../model/types/adminBannerMarketingSchema";

export const adminBannerMarketingListAdapter = (data: GetAdminBannerMarketingList[]) => data.map(
    (item) => {
        const {
            id, name, description, url, isActive, type,
        } = item;
        return {
            id,
            name,
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
        name, description, image, isActive, type, url,
    } = data;

    if (!type) {
        throw new Error("Banner type is required");
    }

    return {
        name,
        description,
        imageId: image?.id ?? null,
        isActive,
        type,
        url,
    };
};

export const adminBannerMarketingAdapter = (
    data: GetAdminMarketingBanner,
): AdminBannerMarketingFileds => {
    const {
        name, description, image, isActive, type, url,
    } = data;

    return {
        name,
        description,
        image,
        isActive,
        type,
        url,
    };
};
