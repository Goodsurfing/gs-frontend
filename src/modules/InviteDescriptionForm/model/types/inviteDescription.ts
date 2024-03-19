import { Category } from "@/entities/Offer";

export interface OfferDescriptionField {
    title: string;
    category: Category[];
    shortDescription: string;
    fullDescription: string;
    coverImage: File;
    images: File[];
}
