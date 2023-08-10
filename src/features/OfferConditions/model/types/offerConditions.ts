import { Housing, Nutrition, Travel } from "@/entities/Offer";

export type HousingFields = {
    switchState: boolean;
    housing: Housing;
};

export type NutritionFields = {
    switchState: boolean;
    nutrition: Nutrition[];
};

export type TravelFields = {
    switchState: boolean;
    nutrition: Travel;
};

export interface OfferConditionsFormFields {
    housing: HousingFields;
    nutrition: NutritionFields;
}
