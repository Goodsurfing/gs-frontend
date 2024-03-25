import {
    ExtraFeatures, Facilities, Housing, Nutrition, Payment, Travel,
} from "@/entities/Offer";

export type HousingFields = {
    switchState: boolean;
    housing?: Housing;
};

export type NutritionFields = {
    switchState: boolean;
    nutrition?: Nutrition;
};

export type TravelFields = {
    switchState: boolean;
    travel?: Travel;
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
