import { OfferFinishingTouches } from "@/entities/Offer";

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
