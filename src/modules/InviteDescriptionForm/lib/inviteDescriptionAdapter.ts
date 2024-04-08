import { OfferDescription } from "@/entities/Offer";

import { OfferDescriptionField } from "../model/types/inviteDescription";
import { GenerateLinkResponse } from "@/shared/hooks/files/useUploadFile";

export const inviteDescriptionApiAdapter = (
    data: OfferDescriptionField,
    coverImage: string,
    extraImages: GenerateLinkResponse[],
): OfferDescription => {
    const extraImagesUuid = extraImages.map((extraImage) => extraImage.uuid);

    return {
        title: data.title,
        description: data.fullDescription,
        shortDescription: data.shortDescription,
        categoryIds: data.category,
        imageId: coverImage,
        galleryIds: extraImagesUuid,
    };
};

export const inviteDescriptionAdapter = (
    data?: OfferDescription,
): Partial<OfferDescriptionField> => {
    if (!data) return {};

    return {
        title: data.title,
        fullDescription: data.description,
        shortDescription: data.shortDescription,
        category: data.categoryIds,
    };
};
