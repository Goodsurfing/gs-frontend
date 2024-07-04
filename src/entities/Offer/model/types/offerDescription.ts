import { MediaObjectType } from "@/types/media";

export type Category = string;

export interface OfferDescription {
    title: string;
    image?: string | MediaObjectType;
    categoryIds: Category[];
    shortDescription: string;
    description: string;
}
