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
        houses: housing.housing,
        foods: nutrition.nutrition,
        transfers: travel.travel,
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
        foods,
        houses,
        transfers,
    } = offerConditions;

    return {
        extraConditions: additionalConditions || "",
        extraFeatures: { extraFeatures: additionalFeatures },
        facilities: { facilities: conveniences },
        housing: { switchState: true, housing: houses || [] },
        nutrition: { switchState: true, nutrition: foods || [] },
        travel: { switchState: true, travel: transfers || [] },
        payment: {
            currency,
            contribution: volunteerContributions,
            reward: volunteerRemuneration,
        },
    };
};
