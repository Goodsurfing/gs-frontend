import { ImageType } from "@/components/ImageInput/types";
import { Category } from "@/entities/Offer";

export interface OfferDescriptionField {
    title: string;
    category: Category[];
    shortDescription: string;
    fullDescription: string;
    coverImage: ImageType;
    images: ImageType[];
}
