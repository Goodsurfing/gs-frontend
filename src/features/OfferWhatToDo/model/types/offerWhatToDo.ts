import type {
    OfferWhatToDoSkill,
    WorkSettings,
} from "@/entities/Offer";
import { WhatToDoSkillType } from "@/types/skills";

export type ExtraSkill = { skill: string };

export type OfferWhatToDoFormSkill = OfferWhatToDoSkill;

export type AdditionalSkillsType = {
    text: string;
};

export interface OfferWhatToDoFormFields {
    skills: WhatToDoSkillType[];
    additionalSkills: AdditionalSkillsType[];
    workingHours: WorkSettings;
    extraInfo: string;
}
