import { OfferConditions } from "@/entities/Offer";

import { OfferConditionsFormFields } from "../model/types/offerConditions";

export const offerConditionsApiAdapter = (
    data: OfferConditionsFormFields,
): OfferConditions => {
    const {
        housing,
        nutrition,
        travel,
        facilities,
        extraFeatures,
        payment,
        extraConditions,
    } = data;

    const { currency, contribution, reward } = payment;

    return {
        housing: housing.housing,
        food: nutrition.nutrition,
        paidTravel: travel.travel,
        conveniences: facilities.facilities,
        additionalConditions: extraConditions,
        additionalFeatures: extraFeatures.extraFeatures,
        volunteerContributions: contribution,
        volunteerRemuneration: reward,
        currency,
    };
};

export const offerConditionsAdapter = (
    offerConditions: OfferConditions,
): OfferConditionsFormFields => {
    const {
        additionalFeatures,
        conveniences,
        currency,
        volunteerContributions,
        volunteerRemuneration,
        additionalConditions,
        food,
        housing,
        paidTravel,
    } = offerConditions;

    return {
        extraConditions: additionalConditions || "",
        extraFeatures: { extraFeatures: additionalFeatures },
        facilities: { facilities: conveniences },
        housing: { switchState: true, housing: housing || [] },
        nutrition: { switchState: true, nutrition: food || [] },
        travel: { switchState: true, travel: paidTravel || [] },
        payment: {
            currency,
            contribution: volunteerContributions,
            reward: volunteerRemuneration,
        },
    };
};
