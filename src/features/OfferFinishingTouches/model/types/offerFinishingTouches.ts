import { ExtraConditions } from "@/entities/Offer";

export interface ExtraConditionsFormFields {
    extraConditions: ExtraConditions;
}

export interface WelcomeMessageFields {
    welcomeMessage: string;
}

export interface RulesInfoFields {
    rules: string;
}

export interface FaqFields {
    faq: string;
}

export interface OfferFinishingTouchesFormFields {
    extraConditions: ExtraConditionsFormFields;
    welcomeMessage: WelcomeMessageFields;
    rules: RulesInfoFields;
    raq: FaqFields;
}
