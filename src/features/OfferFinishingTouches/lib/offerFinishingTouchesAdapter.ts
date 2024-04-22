import {
    OfferFinishingTouches,
    OfferFinishingTouchesApi,
} from "@/entities/Offer";

import { OfferFinishingTouchesFormFields } from "../model/types/offerFinishingTouches";

export const offerFinishingTouchesApiAdapter = (
    data: OfferFinishingTouchesFormFields,
): OfferFinishingTouches => {
    const {
        extraConditions,
        onlyVerified,
        questionnaireUrl,
        questions,
        rules,
        welcomeMessage,
    } = data;
    return {
        extraConditions,
        rulesInfo: rules,
        welcomeMessage,
        onlyVerified,
        questionnaireUrl,
        questions,
    };
};

export const offerFinishingTouchesAdapter = (
    offerFinishingTouches: OfferFinishingTouchesApi,
): OfferFinishingTouchesFormFields => {
    const {
        helloText,
        onlyVerified,
        questionnaireUrl,
        questions,
        roles,
        additionalConditions,
    } = offerFinishingTouches;

    return {
        welcomeMessage: helloText,
        extraConditions: additionalConditions || [],
        onlyVerified,
        questionnaireUrl,
        questions,
        rules: roles,
    };
};
