import { AdditionalSkillsType } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import { IOptionLevelLanguage, IOptionLanguage } from "@/types/select";
import { WhatToDoSkillType } from "@/types/skills";

export interface LanguageSkills {
    language?: IOptionLanguage;
    level?: IOptionLevelLanguage;
}

export interface VolunteerSkillsField {
    skills: WhatToDoSkillType[];
    additionalSkills: AdditionalSkillsType[];
    languages?: LanguageSkills[];
    extraInfo?: string;
}
