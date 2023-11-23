import { AdditionalSkillsType } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import { OfferWhatToDoSkillType } from "@/entities/Offer";

export type LanguageOptions = {
    value: "english" | "spanish" | "russian";
    text: "Английский" | "Испанский" | "Русский";
};

export type LanguageLevelOptions = {
    value:
    | "beginner"
    | "intermediate"
    | "proficient"
    | "fluent";
    text: "Начальный" | "Средний" | "Хороший" | "Разговорный"
};

export interface LanguageSkills {
    language: LanguageOptions;
    level: LanguageLevelOptions;
}

export interface VolunteerSkillsField {
    skills: OfferWhatToDoSkillType[];
    additionalSkills: AdditionalSkillsType[];
    languages: LanguageSkills[];
    extraInfo?: string;
}
