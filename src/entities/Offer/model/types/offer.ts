export interface OfferWhere {
    address?: string;
}

interface OfferWhenPeriods {
    from: string;
    to: string;
}

export interface OfferWhen {
    periods?: OfferWhenPeriods;
    participationPeriod?: string;
    closingDate?: string;
}

type Gender = "woman" | "man" | "other";

type Languages = string[];

type ReceptionPlace = "any" | "foreigners" | "compatriot";

export interface OfferWhoNeeds {
    gender: Gender;
    age?: string;
    languages: Languages;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo?: string;
}

type Category = string;

export interface OfferDescription {
    title: string;
    category: Category[];
    shortDescription: string;
    longDescription: string;
    images: string;
}

type Skill = string;

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type TimeType = "week" | "mounth";

export interface OfferWhatToDo {
    skills: Skill[];
    workingHours: string;
    timeType: TimeType;
    dayOffs: Day;
    additional?: string;
}

type Housing = "house" | "room" | "bed" | "tent" | "tent-place";

type Nutrition = "full" | "breakfast" | "products" | "vegetarian";

type Travel = "full" | "reimbursement" | "partial" | "pick-up" | "transfer";

type Facilities = "hot-water" | "wi-fi" | "electicity" | "conditioner" | "bath";

type ExtraFeatures = "master-class" | "excursions" | "horses" | "languages" | "additional";

type Currency = "RUB" | "EUR" | "USD";

interface Payment {
    contribution?: number;
    reward?: number;
    currency: Currency;
}

export interface OfferConditions {
    housing?: Housing;
    nutrition?: Nutrition[];
    travel?: Travel[];
    facilities: Facilities[];
    extraFeatures: ExtraFeatures[];
    payment: Payment;
    extraConditions?: string;
}

type ExtraConditions = "allow-kids" | "allow-pets" | "couples" | "students" | "vegeterian" | "adult-only";

export interface OfferFinishingTouches {
    extraConditions?: ExtraConditions;
    welcomeMessage: string;
    rulesInfo: string;
    faq: string;
}

export interface Offer {
    where: OfferWhere;
    when: OfferWhen;
    whoNeeds: OfferWhoNeeds;
    description: OfferDescription;
    whatToDo: OfferWhatToDo;
    conditions: OfferConditions;
    finishingTouches: OfferFinishingTouches;
}

export interface OfferSchema {
    data?: Offer;
    form?: Offer;
}
