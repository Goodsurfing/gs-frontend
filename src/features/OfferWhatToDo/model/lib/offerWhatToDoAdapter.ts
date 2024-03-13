import { OfferWhatToDo } from "@/entities/Offer";

import { OfferWhatToDoFormFields } from "../types/offerWhatToDo";

export const offerWhatToDoApiAdapter = (
    data: OfferWhatToDoFormFields,
): OfferWhatToDo => {
    const {
        additionalSkills, skills, workingHours, extraInfo,
    } = data;

    const skillsTemp = skills.map((skill) => ({ text: skill }));

    const { hours, dayOff, timeType } = workingHours;

    const additionalSkillsTemp = additionalSkills.map(
        (additionalSkill) => additionalSkill.text,
    );

    return {
        skillIds: skillsTemp,
        additionalSkills: additionalSkillsTemp,
        hours,
        dayOff,
        timeType,
        externalInfo: extraInfo,
    };
};
