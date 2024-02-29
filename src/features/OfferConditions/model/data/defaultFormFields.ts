import { DefaultValues } from "react-hook-form";
import { OfferConditionsFormFields } from "../types/offerConditions";

export const defaultFormFields: DefaultValues<OfferConditionsFormFields> = {
    housing: {
        switchState: true,
        housing: undefined,
    },
    nutrition: {
        switchState: true,
        nutrition: undefined,
    },
    travel: {
        switchState: true,
        travel: undefined,
    },
    facilities: {
        facilities: [],
    },
    extraFeatures: {
        extraFeatures: [],
    },
    payment: {
        currency: "RUB",
    },
};
