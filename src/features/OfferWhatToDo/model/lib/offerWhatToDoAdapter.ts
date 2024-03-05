import { OfferWhatToDo } from "@/entities/Offer";

import { OfferWhatToDoFormFields } from "../types/offerWhatToDo";

export const offerWhatToDoApiAdapter = (
    data: OfferWhatToDoFormFields,
): Partial<OfferWhatToDo> => {
    const {
        additionalSkills, skills, workingHours, extraInfo,
    } = data;

    const skillsTemp = skills.map((skill) => ({ text: skill }));

    const additionalSkillsTemp = additionalSkills.map(
        (additionalSkill) => additionalSkill.text,
    );

    return {
        skills: skillsTemp,
        additionalSkills: additionalSkillsTemp,
        workingHours,
        extraInfo,
    };
};
