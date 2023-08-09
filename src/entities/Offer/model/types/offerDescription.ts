export type Category = string;

export interface OfferDescription {
    title: string;
    category: Category[];
    shortDescription: string;
    longDescription: string;
    images: string;
}
