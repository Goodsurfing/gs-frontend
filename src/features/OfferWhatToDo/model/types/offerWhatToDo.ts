import type {
    OfferWhatToDoSkill,
    OfferWhatToDoSkillType,
    WorkSettings,
} from "@/entities/Offer";

export type ExtraSkill = { skill: string };

export type OfferWhatToDoFormSkill = OfferWhatToDoSkill;

// export type WorkingHours = {
//     hours: number;
//     timeType: "week" | "day" | "mounth";
//     dayOffs: number;
// };

export type AdditionalSkillsType = {
    text: string;
};

export interface OfferWhatToDoFormFields {
    skills: OfferWhatToDoSkillType[];
    additionalSkills: AdditionalSkillsType[];
    workingHours: WorkSettings;
    extraInfo: string;
}
