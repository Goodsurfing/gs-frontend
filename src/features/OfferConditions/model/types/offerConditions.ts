import {
    ExtraFeatures, Facilities, Payment,
} from "@/entities/Offer";

export type HousingFields = {
    switchState: boolean;
    housing: number[];
};

export type NutritionFields = {
    switchState: boolean;
    nutrition: number[];
};

export type TravelFields = {
    switchState: boolean;
    travel: number[];
};

export type FacilitiesFields = {
    facilities: Facilities[];
};

export type ExtraFeaturesFields = {
    extraFeatures: ExtraFeatures[];
};

export interface OfferConditionsFormFields {
    housing: HousingFields;
    nutrition: NutritionFields;
    travel: TravelFields;
    facilities: FacilitiesFields;
    extraFeatures: ExtraFeaturesFields;
    payment: Payment;
    extraConditions: string;
}
