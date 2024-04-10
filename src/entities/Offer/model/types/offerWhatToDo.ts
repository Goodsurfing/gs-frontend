export type OfferWhatToDoSkillType =
| "admin" | "cooking" | "driving" | "housing" | "decor"
| "tourism" | "art" | "farming" | "social" | "recording" | "gardening"
| "music" | "photo" | "night_job" | "sport";

export type OfferWhatToDoSkill = {
    text: OfferWhatToDoSkillType;
};

// export type DayOff = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TimeType = "week" | "day" | "month";

export type WorkSettings = {
    hours: number;
    timeType: TimeType;
    dayOff: number;
};

export interface OfferWhatToDo {
    skillIds: OfferWhatToDoSkill[];
    additionalSkills?: string[];
    hours: number;
    timeType: TimeType;
    dayOff: number;
    externalInfo?: string;
}

export interface OfferWhatToDoApi {
    skills: OfferWhatToDoSkill[];
    additionalSkills?: string[];
    hours: number;
    timeType: TimeType;
    dayOff: number;
    externalInfo?: string;
}
