import { AdditionalSkillsType } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import { OfferWhatToDoSkillType } from "@/entities/Offer";

export type LanguageOptions = "english" | "spanish" | "russian";

export type LanguageLevelOptions =
    | "beginner"
    | "intermediate"
    | "proficient"
    | "fluent";

export interface LanguageSkills {
    language?: LanguageOptions;
    level?: LanguageLevelOptions;
}

export interface VolunteerSkillsField {
    skills: OfferWhatToDoSkillType[];
    additionalSkills: AdditionalSkillsType[];
    languages?: LanguageSkills[];
    extraInfo?: string;
}
