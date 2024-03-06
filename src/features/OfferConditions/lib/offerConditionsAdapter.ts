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

    return {
        housing: housing.housing,
        nutrition: nutrition.nutrition,
        travel: travel.travel,
        facilities: facilities.facilities,
        extraConditions,
        extraFeatures: extraFeatures.extraFeatures,
        payment,
    };
};
