import { AdditionalSkillsType } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import { WhatToDoSkillType } from "@/types/skills";
import { Language } from "@/types/languages";

export interface VolunteerSkillsField {
    skills: WhatToDoSkillType[];
    additionalSkills: AdditionalSkillsType[];
    languages?: Language[];
    extraInfo?: string;
}
