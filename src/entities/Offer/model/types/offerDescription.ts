import { CategoryImageObject } from "@/types/categories";
import { Image } from "@/types/media";

export interface OfferDescription {
    title: string;
    image: Image | null;
    categories: CategoryImageObject[];
    shortDescription: string;
    description: string;
}

export interface UpdateOfferDescription {
    title: string,
    shortDescription: string,
    description: string,
    imageId: string | null,
    categoryIds: number[];
}

export interface UpdateOfferDescriptionParams {
    offerId: number;
    body: UpdateOfferDescription;
}
