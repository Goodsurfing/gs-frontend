import { AdditionalSkillsType } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import { OfferWhatToDoSkillType } from "@/entities/Offer";

import { IOptionLevelLanguage, IOptionLanguage } from "@/types/select";

export interface LanguageSkills {
    language?: IOptionLanguage;
    level?: IOptionLevelLanguage;
}

export interface VolunteerSkillsField {
    skills: OfferWhatToDoSkillType[];
    additionalSkills: AdditionalSkillsType[];
    languages?: LanguageSkills[];
    extraInfo?: string;
}
