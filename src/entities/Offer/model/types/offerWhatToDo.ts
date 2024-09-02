import { WhatToDoSkillType } from "@/types/skills";

export type OfferWhatToDoSkill = {
    text: WhatToDoSkillType;
};

// export type DayOff = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TimeType = "week" | "day" | "month";

export type WorkSettings = {
    hours: number;
    timeType: TimeType;
    dayOff: number;
};

export interface OfferWhatToDo {
    skills: OfferWhatToDoSkill[];
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
