import { ImageType } from "@/components/ImageInput/types";

import { OfferDescription } from "@/entities/Offer";
import { OfferDescriptionApi } from "@/entities/Offer/model/types/offerDescription";

import { GenerateLinkResponse } from "@/shared/hooks/files/useUploadFile";

import { OfferDescriptionField } from "../model/types/inviteDescription";

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
    data?: OfferDescriptionApi,
): Partial<OfferDescriptionField> => {
    if (!data) return {};

    const imagesTemp: ImageType[] = data.gallery.map(
        (image): ImageType => ({ file: null, src: image.url }),
    );

    return {
        title: data.title,
        fullDescription: data.description,
        shortDescription: data.shortDescription,
        coverImage: { file: null, src: data.image.url },
        category: data.categoryIds,
        images: imagesTemp,
    };
};
