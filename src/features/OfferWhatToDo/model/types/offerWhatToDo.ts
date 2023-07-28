import type {
    OfferWhatToDoSkill,
    OfferWhatToDoSkillType,
    WorkSettings,
} from "@/entities/Offer";

export type ExtraSkill = { skill: string };

export type OfferWhatToDoFormSkill = OfferWhatToDoSkill;

export type WorkingHours = {
    hours: number;
    timeType: "week" | "day" | "mounth";
};

export interface OfferWhatToDoFormFields {
    skills: OfferWhatToDoSkillType[];
    additionalSkills?: string[];
    workingHours: WorkSettings;
    extraInfo?: string;
}
