import { OfferDescription } from "@/entities/Offer";

import { OfferDescriptionField } from "../model/types/inviteDescription";
import { BASE_URL } from "@/shared/constants/api";

export const inviteDescriptionApiAdapter = (
    data: OfferDescriptionField,
    isSession: boolean = false,
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

    if (isSession) {
        result.image = {
            "@id": data.coverImage.uuid ?? "",
            id: data.coverImage.uuid ?? "",
            contentUrl: data.coverImage.image.src ?? "",
            isImage: true,
            mimeType: "",
            originalHeight: 0,
            originalWidth: 0,
        };
    }

    return result;
};

export const inviteDescriptionAdapter = (
    data?: OfferDescription,
): Partial<OfferDescriptionField> => {
    if (!data) return {};

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
    };
};

export const inviteDescriptionStorageAdapter = (
    data?: OfferDescription,
): Partial<OfferDescriptionField> => {
    if (!data) return {};

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
        coverImage: { uuid: imageUuid || null, image: { file: null, src: imageSrc || null } },
        category: data.categoryIds,
    };
};
