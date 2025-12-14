import { AdditionalSkillsType } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import { Skill } from "@/types/skills";
import { Language } from "@/types/languages";

export interface VolunteerSkillsField {
    skills: Skill[];
    additionalSkills: AdditionalSkillsType[];
    languages?: Language[];
    extraInfo?: string;
}
