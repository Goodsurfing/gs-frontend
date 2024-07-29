import { ExtraConditions } from "@/entities/Offer";

export type WelcomeMessageFields = string;

export type RulesInfoFields = string;

export type FaqFields = string;

export interface OfferFinishingTouchesFormFields {
    extraConditions: ExtraConditions[];
    welcomeMessage: WelcomeMessageFields;
    rules: RulesInfoFields;
    onlyVerified: boolean;
    questionnaireUrl: string;
    questions: string;
}
