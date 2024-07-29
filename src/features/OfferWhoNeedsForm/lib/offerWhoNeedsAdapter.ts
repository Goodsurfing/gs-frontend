import { OfferWhoNeeds } from "@/entities/Offer";

import { OfferWhoNeedsFields } from "../model/types/offerWhoNeeds";

export const offerWhoNeedsAdapter = (
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
        additionalInfo: additionalInfo || "",
        receptionPlace,
        volunteerPlaceCount: volunteerPlaces,
        gender,
        requiredLanguages: languages,
    };
};

export const offerWhoNeedsApiAdapter = (
    whoNeeds: OfferWhoNeeds,
): OfferWhoNeedsFields => {
    const {
        needAllLanguages,
        ageMax,
        ageMin,
        gender,
        receptionPlace,
        requiredLanguages,
        volunteerPlaceCount,
        additionalInfo,
    } = whoNeeds;

    return {
        age: { maxAge: ageMax, minAge: ageMin },
        gender,
        languages: requiredLanguages,
        needAllLanguages,
        receptionPlace,
        volunteerPlaces: volunteerPlaceCount,
        additionalInfo,
    };
};
