import { Housing } from "@/entities/Offer";

export type HousingFields = {
    switchState: boolean;
    housing: Housing;
};

export interface OfferConditionsFormFields {
    housing: HousingFields;
}
