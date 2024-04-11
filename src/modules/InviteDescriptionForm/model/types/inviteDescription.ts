import { ImageType } from "@/components/ImageInput/types";
import { Category } from "@/entities/Offer";

export interface DescriptionImage {
    uuid: string | null
    image: ImageType
}

export interface OfferDescriptionField {
    title: string;
    category: Category[];
    shortDescription: string;
    fullDescription: string;
    coverImage: DescriptionImage;
    images: DescriptionImage[];
}
