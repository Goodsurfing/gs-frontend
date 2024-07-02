import {
    OfferFinishingTouches,
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
        additionalConditions: extraConditions,
        roles: rules,
        helloText: welcomeMessage,
        onlyVerified,
        questionnaireUrl,
        questions,
    };
};

export const offerFinishingTouchesAdapter = (
    offerFinishingTouches: OfferFinishingTouches,
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
