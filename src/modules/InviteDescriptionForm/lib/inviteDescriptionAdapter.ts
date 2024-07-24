import { OfferDescription } from "@/entities/Offer";

import { OfferDescriptionField } from "../model/types/inviteDescription";
import { BASE_URL } from "@/shared/constants/api";

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
    let imageSrc: string | null = null;
    let imageUuid: string | null = null;
    if (typeof data.image === "string" || data.image === null) {
        imageSrc = data.image;
        imageUuid = data.image;
    } else if (data.image && typeof data.image === "object") {
        imageSrc = data.image.contentUrl;
        imageUuid = data.image["@id"];
    }

    return {
        title: data.title,
        fullDescription: data.description,
        shortDescription: data.shortDescription,
        coverImage: { uuid: `${BASE_URL}${imageUuid?.slice(1)}` || null, image: { file: null, src: `${BASE_URL}${imageSrc?.slice(1)}` || null } },
        category: data.categoryIds,
        // images: imagesTemp,
    };
};
