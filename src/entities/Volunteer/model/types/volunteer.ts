import { Offer } from "@/entities/Offer";
import { Profile } from "@/entities/Profile";
import { Gallery } from "@/modules/Gallery/model/types/gallery";
import { SkillsData } from "@/shared/data/skills";

export interface Volunteer extends Profile {
    skills?: SkillsData[];
    languages?: string[];
    offers?: Offer[];
    // review?: Review to do review type
    gallery: Gallery;
    // videoGallery?: VideoGallery to do VideoGallery type
    certificates: string[];
    // articles?: Article to do Article type
    favoriteOffers?: Offer[];
    isMember: boolean;
}
