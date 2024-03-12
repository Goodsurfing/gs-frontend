export type Housing = Readonly<"house" | "room" | "bed" | "tent" | "tent_place">;

export type Nutrition = Readonly<"full" | "breakfast" | "products" | "vegetarian">;

export type Travel = Readonly<"full" | "reimbursement" | "partial" | "pick-up" | "transfer">;

export type Facilities = Readonly<"hot-water" | "wi-fi" | "electricity" | "conditioner" | "bath">;

export type ExtraFeatures = Readonly<"master_class" | "excursions" | "horses" | "languages" | "additional">;

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
