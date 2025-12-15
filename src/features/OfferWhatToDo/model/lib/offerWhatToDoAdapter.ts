import { OfferWhatToDo } from "@/entities/Offer";

import { OfferWhatToDoFormFields } from "../types/offerWhatToDo";
import { UpdateOfferWhatToDo } from "@/entities/Offer/model/types/offerWhatToDo";

export const offerWhatToDoApiAdapter = (
    data: OfferWhatToDoFormFields,
): UpdateOfferWhatToDo => {
    const {
        additionalSkills, skills, workingHours, extraInfo,
    } = data;

    const { hours, dayOff, timeType } = workingHours;

    const additionalSkillsTemp = additionalSkills.map(
        (additionalSkill) => additionalSkill.text,
    );

    return {
        skillIds: skills,
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

    const additionalSkillsTemp = additionalSkills?.map((additionalSkill) => ({
        text: additionalSkill,
    }));
    const skillsTemp = skills.map((skill) => skill.id);

    return {
        skills: skillsTemp,
        additionalSkills: additionalSkillsTemp || [],
        workingHours: {
            hours,
            dayOff,
            timeType,
        },
        extraInfo: externalInfo ?? "",
    };
};
