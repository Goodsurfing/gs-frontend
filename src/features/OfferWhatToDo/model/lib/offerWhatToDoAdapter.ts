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
        skills: skillsTemp,
        additionalSkills: additionalSkillsTemp,
        hours,
        dayOff,
        timeType,
        externalInfo: extraInfo,
    };
};

export const offerWhatToDoAdapter = (
    offerWhatToDo: OfferWhatToDo,
): OfferWhatToDoFormFields => {
    const {
        dayOff, hours, skills, timeType, additionalSkills, externalInfo,
    } = offerWhatToDo;

    const skillsTemp = skills.map((skill) => skill.text);
    const additionalSkillsTemp = additionalSkills?.map((additionalSkill) => ({
        text: additionalSkill,
    }));

    return {
        skills: skillsTemp,
        additionalSkills: additionalSkillsTemp || [],
        workingHours: {
            hours,
            dayOff,
            timeType,
        },
        extraInfo: externalInfo || "",
    };
};
