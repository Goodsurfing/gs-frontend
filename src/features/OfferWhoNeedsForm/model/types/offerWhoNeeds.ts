import { Gender, Languages, ReceptionPlace } from "@/entities/Offer";
import { Age } from "@/entities/Offer/model/types/offerWhoNeeds";

export interface OfferWhoNeedsFields {
    gender: Gender[];
    age: Age;
    languages: Languages;
    needAllLanguages: boolean;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo: string;
}
