import { OfferWhoNeeds, OldOfferWhoNeeds } from "@/entities/Offer";

import { OfferWhoNeedsFields } from "../model/types/offerWhoNeeds";
import { MAX_AGE_FOR_VOLUNTEER, MINIMAL_AGE_FOR_VOLUNTEER } from "../components/Age/Age";

export const offerWhoNeedsAdapter = (
    whoNeedsForm: OfferWhoNeedsFields,
): OldOfferWhoNeeds => {
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
        ageMax: age.maxAge ?? MAX_AGE_FOR_VOLUNTEER,
        ageMin: age.minAge ?? MINIMAL_AGE_FOR_VOLUNTEER,
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
        genders,
        receptionPlace,
        languages,
        volunteerPlaceCount,
        additionalInfo,
    } = whoNeeds;

    return {
        age: { maxAge: ageMax, minAge: ageMin },
        gender: genders,
        languages,
        needAllLanguages,
        receptionPlace,
        volunteerPlaces: volunteerPlaceCount,
        additionalInfo,
    };
};
