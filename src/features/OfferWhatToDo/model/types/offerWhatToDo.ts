export type ExtraSkill = { skill: string };

export type WorkingHours = {
    hours: number;
    timeType: "week" | "day" | "mounth";
};

export type Skill = {
    id: number;
    text: string;
};

export interface OfferWhatToDo {
    skills: Skill[];
    extraSkills?: ExtraSkill[];
    workingHours: WorkingHours[];
    extraInfo?: string;
}
