import { OfferDescription } from "@/entities/Offer";

import { OfferDescriptionField } from "../model/types/inviteDescription";

export const inviteDescriptionApiAdapter = (
    data: OfferDescriptionField,
    coverImage: string,
    extraImages: (string | undefined)[],
): OfferDescription => {
    const filteredExtraImages: string[] = extraImages.filter(
        (item): item is string => item !== undefined,
    );

    return {
        title: data.title,
        longDescription: data.fullDescription,
        shortDescription: data.shortDescription,
        category: data.category,
        titleImage: coverImage,
        images: filteredExtraImages,
    };
};

export const inviteDescriptionAdapter = (
    data?: OfferDescription,
): Partial<OfferDescriptionField> => {
    if (!data) return {};

    return {
        title: data.title,
        fullDescription: data.longDescription,
        shortDescription: data.shortDescription,
        category: data.category,
        coverImage: data.titleImage,
        images: data.images,
    };
};
