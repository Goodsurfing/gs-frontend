import { CategoryType } from "@/types/categories";
import { MediaObjectType } from "@/types/media";

export interface OfferDescription {
    title: string;
    image?: string | MediaObjectType;
    categoryIds: CategoryType[];
    shortDescription: string;
    description: string;
}
