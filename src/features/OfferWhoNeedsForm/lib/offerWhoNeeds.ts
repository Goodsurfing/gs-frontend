import { Gender, Languages, ReceptionPlace } from "@/entities/Offer";

export interface OfferWhoNeedsFields {
    gender: Gender;
    age?: string;
    languages: Languages;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo?: string;
}
