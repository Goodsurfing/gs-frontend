import { OfferConditions, UpdateOfferConditions } from "@/entities/Offer";

import { OfferConditionsFormFields } from "../model/types/offerConditions";

export const offerConditionsApiAdapter = (
    data: OfferConditionsFormFields,
): UpdateOfferConditions => {
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
        houseIds: housing.housing,
        foodIds: nutrition.nutrition,
        transferIds: travel.travel,
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
    const housesTemp = houses.map((house) => house.id);
    const foodTemp = foods.map((food) => food.id);
    const transferTemp = transfers.map((transfer) => transfer.id);

    return {
        extraConditions: additionalConditions || "",
        extraFeatures: { extraFeatures: additionalFeatures },
        facilities: { facilities: conveniences },
        housing: { switchState: true, housing: housesTemp || [] },
        nutrition: { switchState: true, nutrition: foodTemp || [] },
        travel: { switchState: true, travel: transferTemp || [] },
        payment: {
            currency,
            contribution: volunteerContributions,
            reward: volunteerRemuneration,
        },
    };
};
