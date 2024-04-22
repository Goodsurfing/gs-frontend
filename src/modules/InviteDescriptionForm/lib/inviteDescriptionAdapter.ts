import { OfferDescription } from "@/entities/Offer";
import { OfferDescriptionApi } from "@/entities/Offer/model/types/offerDescription";

import { DescriptionImage, OfferDescriptionField } from "../model/types/inviteDescription";

export const inviteDescriptionApiAdapter = (
    data: OfferDescriptionField,
    coverImage: string,
    extraImages: string[],
): OfferDescription => ({
    title: data.title,
    description: data.fullDescription,
    shortDescription: data.shortDescription,
    categoryIds: data.category,
    imageId: coverImage,
    galleryIds: extraImages,
});

export const inviteDescriptionAdapter = (
    data?: OfferDescriptionApi,
): Partial<OfferDescriptionField> => {
    if (!data) return {};

    const imagesTemp: DescriptionImage[] = data.gallery.map(
        (image): DescriptionImage => ({ uuid: image.id, image: { file: null, src: image.url } }),
    );

    return {
        title: data.title,
        fullDescription: data.description,
        shortDescription: data.shortDescription,
        coverImage: { uuid: data.image.id, image: { file: null, src: data.image.url } },
        category: data.categoryIds,
        images: imagesTemp,
    };
};
