export type Housing = Readonly<"house" | "room" | "bed" | "tent" | "tent_place">;

export type Nutrition = Readonly<"full" | "breakfast" | "products" | "vegetarian">;

export type Travel = Readonly<"full" | "reimbursement" | "partial" | "pick-up" | "transfer">;

export type Facilities = Readonly<"hot-water" | "wi-fi" | "electricity" | "conditioner" | "bath">;

export type ExtraFeatures = Readonly<"master_class" | "excursions" | "horses" | "languages" | "additional">;

export type Currency = Readonly<"RUB" | "EUR" | "USD">;

export interface Payment {
    contribution: number;
    reward: number;
    currency: Currency;
}

export interface OfferConditions {
    houses: Housing[];
    foods: Nutrition[];
    transfers: Travel[];
    conveniences: Facilities[];
    additionalFeatures: ExtraFeatures[];
    volunteerContributions: number;
    volunteerRemuneration: number;
    currency: Currency;
    additionalConditions: string;
}

export interface OfferConditionsApi {
    housing: Housing[];
    food: Nutrition[];
    conveniences: Facilities[];
    paidTravel: Travel[];
    additionalFeatures: ExtraFeatures[];
    volunteerContributions: number;
    volunteerRemuneration: number;
    currency: Currency;
    additionalConditions: string;
}

export interface UpdateOfferConditions {
    additionalConditions: string,
    currency: Currency;
    additionalFeatures: ExtraFeatures[];
    conveniences: Facilities[];
    foodIds: number[];
    houseIds: number[];
    transferIds: number[],
    volunteerContributions: number;
    volunteerRemuneration: number;
}

export interface UpdateOfferConditionsParams {
    offerId: number;
    body: UpdateOfferConditions;
}
