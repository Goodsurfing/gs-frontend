import { DefaultValues } from "react-hook-form";
import { OfferConditionsFormFields } from "../types/offerConditions";

export const defaultFormFields: DefaultValues<OfferConditionsFormFields> = {
    housing: {
        switchState: true,
        housing: [],
    },
    nutrition: {
        switchState: true,
        nutrition: [],
    },
    travel: {
        switchState: true,
        travel: [],
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
