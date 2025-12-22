import type {
    OfferWhatToDoSkill,
    WorkSettings,
} from "@/entities/Offer";

export type ExtraSkill = { skill: string };

export type OfferWhatToDoFormSkill = OfferWhatToDoSkill;

export type AdditionalSkillsType = {
    text: string;
};

export interface OfferWhatToDoFormFields {
    skills: number[];
    additionalSkills: AdditionalSkillsType[];
    workingHours: WorkSettings;
    extraInfo: string;
}
