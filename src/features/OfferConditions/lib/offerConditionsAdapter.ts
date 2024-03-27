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
