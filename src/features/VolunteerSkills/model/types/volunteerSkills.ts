import { AdditionalSkillsType } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import { Language } from "@/types/languages";

export interface VolunteerSkillsField {
    skills: number[];
    additionalSkills: AdditionalSkillsType[];
    languages?: Language[];
    extraInfo?: string;
}
