import { OfferDescription } from "@/entities/Offer";

import { OfferDescriptionField } from "../model/types/inviteDescription";

export const inviteDescriptionApiAdapter = (
    data: OfferDescriptionField,
): OfferDescription => {
    const result: OfferDescription = {
        title: data.title,
        description: data.fullDescription,
        shortDescription: data.shortDescription,
        categoryIds: data.category,
    };

    if (data.coverImage.uuid) {
        result.image = data.coverImage.uuid;
    }

    return result;
};

export const inviteDescriptionAdapter = (
    data?: OfferDescription,
): Partial<OfferDescriptionField> => {
    if (!data) return {};

    // const imagesTemp: DescriptionImage[] = data.gallery.map(
    //     (image): DescriptionImage => ({ uuid: image.id, image: { file: null, src: image.url } }),
    // );

    return {
        title: data.title,
        fullDescription: data.description,
        shortDescription: data.shortDescription,
        coverImage: { uuid: data.image || null, image: { file: null, src: data.image || null } },
        category: data.categoryIds,
        // images: imagesTemp,
    };
};
