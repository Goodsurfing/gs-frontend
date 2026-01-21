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

    const additionalSkillsTemp = additionalSkills?.map(
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
        dayOff, hour, skills, timeType, additionalSkills, externalInfo,
    } = offerWhatToDo;

    const additionalSkillsTemp = additionalSkills?.map((additionalSkill) => ({
        text: additionalSkill,
    }));
    const skillsTemp = skills?.map((skill) => skill.id);

    return {
        skills: skillsTemp,
        additionalSkills: additionalSkillsTemp || [],
        workingHours: {
            hours: hour,
            dayOff,
            timeType,
        },
        extraInfo: externalInfo ?? "",
    };
};

export const sessionStorageToFormAdapter = (
    data: Partial<UpdateOfferWhatToDo>,
): OfferWhatToDoFormFields => {
    const {
        skillIds = [],
        additionalSkills = [],
        hours = 6,
        dayOff = 2,
        timeType = "week",
        externalInfo = "",
    } = data;

    return {
        skills: Array.isArray(skillIds) ? skillIds : [],
        additionalSkills: Array.isArray(additionalSkills)
            ? additionalSkills.map((text) => ({ text }))
            : [],
        workingHours: {
            hours: typeof hours === "number" ? hours : 6,
            dayOff: typeof dayOff === "number" ? dayOff : 2,
            timeType: ["week", "day", "month"].includes(timeType) ? timeType : "week",
        },
        extraInfo: typeof externalInfo === "string" ? externalInfo : "",
    };
};
