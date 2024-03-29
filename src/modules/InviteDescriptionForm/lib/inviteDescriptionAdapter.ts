import { OfferDescription } from "@/entities/Offer";

import { OfferDescriptionField } from "../model/types/inviteDescription";

export const inviteDescriptionApiAdapter = (
    data: OfferDescriptionField,
): Partial<OfferDescription> => ({
    title: data.title,
    longDescription: data.fullDescription,
    shortDescription: data.shortDescription,
    category: data.category,
    titleImage: data.coverImage,
    images: data.images,
});

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
