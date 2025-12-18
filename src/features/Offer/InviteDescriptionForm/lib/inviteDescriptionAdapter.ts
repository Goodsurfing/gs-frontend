import { OfferDescription, UpdateOfferDescription } from "@/entities/Offer";

import { OfferDescriptionField } from "../model/types/inviteDescription";

export const inviteDescriptionApiAdapter = (
    data: OfferDescriptionField,
    // isSession: boolean = false,
): UpdateOfferDescription => {
    const result: UpdateOfferDescription = {
        title: data.title,
        description: data.fullDescription,
        shortDescription: data.shortDescription,
        categoryIds: data.category,
        imageId: data.coverImage ? data.coverImage.id : null,
    };

    return result;
};

export const inviteDescriptionAdapter = (
    data: OfferDescription,
): Partial<OfferDescriptionField> => {
    const {
        title, description, shortDescription, image, categories,
    } = data;
    const categoriesTemp = categories?.map((cat) => cat.id);

    return {
        title,
        fullDescription: description,
        shortDescription,
        coverImage: image,
        category: categoriesTemp,
    };
};
