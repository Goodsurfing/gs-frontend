import { ImageType } from "@/components/ImageInput/types";
import { CategoryType } from "@/types/categories";

export interface DescriptionImage {
    uuid: string | null
    image: ImageType;
}

export interface OfferDescriptionField {
    title: string;
    category: CategoryType[];
    shortDescription: string;
    fullDescription: string;
    coverImage: DescriptionImage;
    // images: DescriptionImage[];
}
