import { OfferFinishingTouches } from "@/entities/Offer";

import { OfferFinishingTouchesFormFields } from "../model/types/offerFinishingTouches";

export const offerFinishingTouchesApiAdapter = (
    data: OfferFinishingTouchesFormFields,
): Partial<OfferFinishingTouches> => {
    const {
        extraConditions, faq, rules, welcomeMessage,
    } = data;
    return {
        extraConditions, faq, rulesInfo: rules, welcomeMessage,
    };
};
