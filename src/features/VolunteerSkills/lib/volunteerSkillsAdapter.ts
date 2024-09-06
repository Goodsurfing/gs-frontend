import { VolunteerApi } from "@/entities/Volunteer";
import { VolunteerSkillsField } from "../model/types/volunteerSkills";
import { AdditionalSkillsType } from "@/features/OfferWhatToDo";

export const volunteerSkillsAdapter = (data: VolunteerSkillsField): Partial<Omit<VolunteerApi, "profile">> => {
    const {
        languages, skills, additionalSkills, extraInfo,
    } = data;

    const additionalSkillsTemp = additionalSkills.map((skill) => skill.text);

    return {
        languages,
        skills,
        additionalSkills: additionalSkillsTemp,
        externalInfo: extraInfo,
    };
};

export const volunteerSkillsApiAdapter = (data: VolunteerApi): VolunteerSkillsField => {
    const {
        languages, skills, additionalSkills, externalInfo,
    } = data;

    const additionalSkillsTemp: AdditionalSkillsType[] = additionalSkills.map(
        (skill) => ({ text: skill }),
    );

    return {
        languages,
        skills,
        additionalSkills: additionalSkillsTemp,
        extraInfo: externalInfo,
    };
};
