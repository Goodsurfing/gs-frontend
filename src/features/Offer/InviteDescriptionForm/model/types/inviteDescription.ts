import { Image } from "@/types/media";

// export interface DescriptionImage {
//     uuid: string | null
//     image: ImageType;
// }

export interface OfferDescriptionField {
    title: string;
    category: number[];
    shortDescription: string;
    fullDescription: string;
    coverImage: Image | null;
    // images: DescriptionImage[];
}
