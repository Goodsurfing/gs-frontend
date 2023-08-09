export type Housing = "house" | "room" | "bed" | "tent" | "tent-place";

export type Nutrition = "full" | "breakfast" | "products" | "vegetarian";

export type Travel = "full" | "reimbursement" | "partial" | "pick-up" | "transfer";

export type Facilities = "hot-water" | "wi-fi" | "electicity" | "conditioner" | "bath";

export type ExtraFeatures = "master-class" | "excursions" | "horses" | "languages" | "additional";

export type Currency = "RUB" | "EUR" | "USD";

export interface Payment {
    contribution?: number;
    reward?: number;
    currency: Currency;
}

export interface OfferConditions {
    housing?: Housing;
    nutrition?: Nutrition;
    travel?: Travel;
    facilities: Facilities[];
    extraFeatures: ExtraFeatures[];
    payment: Payment;
    extraConditions?: string;
}
