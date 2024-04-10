import { OfferWhoNeeds, OfferWhoNeedsApi } from "@/entities/Offer";

import { OfferWhoNeedsFields } from "../model/types/offerWhoNeeds";

export const offerWhoNeedsApapter = (
    whoNeedsForm: OfferWhoNeedsFields,
): OfferWhoNeeds => {
    const {
        age,
        gender,
        languages,
        receptionPlace,
        volunteerPlaces,
        additionalInfo,
        needAllLanguages,
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

export const offerWhoNeedsApiAdapter = (
    whoNeeds: OfferWhoNeedsApi,
): OfferWhoNeedsFields => {
    const {
        needAllLanguages,
        ageMax,
        ageMin,
        genders,
        receptionPlace,
        requiredLanguages,
        volunteerPlaceCount,
        additionalInfo,
    } = whoNeeds;

    return {
        age: { maxAge: ageMax, minAge: ageMin },
        gender: genders,
        languages: requiredLanguages,
        needAllLanguages,
        receptionPlace,
        volunteerPlaces: volunteerPlaceCount,
        additionalInfo,
    };
};
