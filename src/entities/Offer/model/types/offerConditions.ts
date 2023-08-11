export type Housing = Readonly<"house" | "room" | "bed" | "tent" | "tent-place">;

export type Nutrition = Readonly<"full" | "breakfast" | "products" | "vegetarian">;

export type Travel = Readonly<"full" | "reimbursement" | "partial" | "pick-up" | "transfer">;

export type Facilities = Readonly<"hot-water" | "wi-fi" | "electicity" | "conditioner" | "bath">;

export type ExtraFeatures = Readonly<"master-class" | "excursions" | "horses" | "languages" | "additional">;

export type Currency = Readonly<"RUB" | "EUR" | "USD">;

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
