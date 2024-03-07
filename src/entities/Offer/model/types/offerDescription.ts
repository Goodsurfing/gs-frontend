import { OfferOrganization } from "./offerOrganization";

export type Category = string;

export interface OfferDescription {
    title: string;
    titleImage?: string;
    category: Category[];
    shortDescription: string;
    longDescription: string;
    images: string[];
}
