export type OfferWhatToDoSkillType =
| "admin" | "cooking" | "driving" | "housing" | "decor"
| "tourism" | "art" | "farming" | "social" | "recording" | "gardening"
| "music" | "photo" | "night_job" | "sport";

export type OfferWhatToDoSkill = {
    id: number;
    text: OfferWhatToDoSkillType;
};

export type DayOff = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TimeType = "week" | "day";

export type WorkSettings = {
    hours: number;
    timeType: TimeType;
    dayOff: DayOff;
};

export interface OfferWhatToDo {
    skills: OfferWhatToDoSkill[];
    additionalSkills?: string[];
    workingHours: WorkSettings;
    extraInfo?: string;
}
