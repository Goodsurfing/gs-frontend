import { OfferWhoNeeds } from "@/entities/Offer";
import { OfferWhoNeedsFields } from "../model/types/offerWhoNeeds";

export const offerWhoNeedsApapter = (whoNeedsForm: OfferWhoNeedsFields): OfferWhoNeeds => {
    const {
        age, gender, languages, receptionPlace, volunteerPlaces, additionalInfo, needAllLanguages,
    } = whoNeedsForm;

    return {
        ageMax: age.maxAge,
        ageMin: age.minAge,
        needAllLanguages,
        additionalInfo,
        receptionPlace,
        volunteerPlaces,
        genders: gender,
        languages,
    };
};
