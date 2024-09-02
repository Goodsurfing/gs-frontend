import { Gender, ReceptionPlace } from "@/entities/Offer";
import { Age } from "@/entities/Offer/model/types/offerWhoNeeds";
import { Language } from "@/types/languages";

export interface OfferWhoNeedsFields {
    gender: Gender[];
    age: Age;
    languages: Language[];
    needAllLanguages: boolean;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo: string;
}
