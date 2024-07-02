export type Category = string;

export interface OfferDescription {
    title: string;
    image?: string;
    categoryIds: Category[];
    shortDescription: string;
    description: string;
}
