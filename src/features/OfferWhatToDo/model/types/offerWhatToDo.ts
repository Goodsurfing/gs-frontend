import type {
    OfferWhatToDoSkill,
    OfferWhatToDoSkillType,
} from "@/entities/Offer";

export type ExtraSkill = { skill: string };

export type OfferWhatToDoFormSkill = OfferWhatToDoSkill;

export type WorkingHours = {
    hours: number;
    timeType: "week" | "day" | "mounth";
    dayOffs: number;
};

export interface OfferWhatToDoFormFields {
    skills: OfferWhatToDoSkillType[];
    additionalSkills?: string[];
    workingHours: WorkingHours;
    extraInfo?: string;
}
