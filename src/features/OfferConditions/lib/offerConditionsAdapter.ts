import { OfferConditions, OfferConditionsApi } from "@/entities/Offer";

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
        housingIds: housing.housing,
        foodIds: nutrition.nutrition,
        paidTravelIds: travel.travel,
        conveniencesIds: facilities.facilities,
        additionalConditions: extraConditions,
        additionalFeaturesIds: extraFeatures.extraFeatures,
        volunteerContributions: contribution,
        volunteerRemuneration: reward,
        currency,
    };
};

export const offerConditionsAdapter = (
    offerConditions: OfferConditionsApi,
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
        housing: { switchState: true, housing: housing?.[0] },
        nutrition: { switchState: true, nutrition: food?.[0] },
        travel: { switchState: true, travel: paidTravel?.[0] },
        payment: {
            currency,
            contribution: volunteerContributions,
            reward: volunteerRemuneration,
        },
    };
};
