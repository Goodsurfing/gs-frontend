import { CategoryImageObject } from "@/types/categories";
import { Image } from "@/types/media";

export interface OfferDescription {
    title: string;
    image: Image | null;
    categories: CategoryImageObject[];
    shortDescription: string;
    description: string;
}
