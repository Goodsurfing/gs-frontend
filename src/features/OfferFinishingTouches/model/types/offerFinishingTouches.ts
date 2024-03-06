import { ExtraConditions } from "@/entities/Offer";

export type ExtraConditionsFormFields = ExtraConditions[];

export type WelcomeMessageFields = string;

export type RulesInfoFields = string;

export type FaqFields = string;

export interface OfferFinishingTouchesFormFields {
    extraConditions: ExtraConditionsFormFields;
    welcomeMessage: WelcomeMessageFields;
    rules: RulesInfoFields;
    onlyVerified: boolean;
    questionnaireUrl: string;
    questions: string;
}
