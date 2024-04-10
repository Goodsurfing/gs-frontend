export type Category = string;

export interface OfferDescription {
    title: string;
    imageId?: string;
    categoryIds: Category[];
    shortDescription: string;
    description: string;
    galleryIds: string[];
}

export interface OfferDescriptionApi {
    id: string;
    title: string;
    image: CoverImageType;
    categoryIds: Category[];
    shortDescription: string;
    description: string;
    gallery: CoverImageType[];
}

interface CoverImageType {
    id: string;
    url: string;
}
