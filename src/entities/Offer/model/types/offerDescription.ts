export type Category = string;

export interface OfferDescription {
    title: string;
    imageId?: string;
    categoryIds: Category[];
    shortDescription: string;
    description: string;
    galleryIds: string[];
}
