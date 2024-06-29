export type ExtraConditions = "allow-kids" | "allow-pets" | "couples" | "students" | "vegetarian" | "adult-only";

export interface OfferFinishingTouches {
    additionalConditions?: ExtraConditions[];
    helloText: string;
    roles: string;
    questionnaireUrl: string;
    questions: string;
    onlyVerified: boolean;
}

export interface OfferFinishingTouchesApi {
    additionalConditions?: ExtraConditions[];
    onlyVerified: boolean;
    helloText: string;
    roles: string;
    questionnaireUrl: string;
    questions: string;
}
