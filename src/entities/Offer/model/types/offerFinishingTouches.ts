export type ExtraConditions = "allow-kids" | "allow-pets" | "couples" | "students" | "vegetarian" | "adult-only";

export interface OfferFinishingTouches {
    extraConditions?: ExtraConditions[];
    welcomeMessage: string;
    rulesInfo: string;
    questionnaireUrl: string;
    questions: string;
    onlyVerified: boolean;
}
