import { UpdateVolunteer } from "@/entities/Volunteer";
import { VolunteerSkillsField } from "../model/types/volunteerSkills";
import { AdditionalSkillsType } from "@/features/OfferWhatToDo";
import { Profile } from "@/entities/Profile";

export const volunteerSkillsAdapter = (data: VolunteerSkillsField): UpdateVolunteer => {
    const {
        languages, skills, additionalSkills, extraInfo,
    } = data;

    const additionalSkillsTemp = additionalSkills.map((skill) => skill.text);
    // const languagesTemp: GetLanguage[] = languages ? languages.map((lang) => ({
    //     id: lang.id,
    //     language: lang.language,
    //     languageLevel: lang.level,
    // })) : [];

    return {
        languages: languages ?? [],
        skillIds: skills,
        additionalSkills: additionalSkillsTemp,
        externalInfo: extraInfo ?? "",
    };
};

export const volunteerSkillsApiAdapter = (data: Profile): VolunteerSkillsField => {
    const {
        volunteer,
    } = data;
    if (volunteer) {
        const {
            additionalSkills, languages, skills, externalInfo,
        } = volunteer;

        const additionalSkillsTemp: AdditionalSkillsType[] = additionalSkills.map(
            (skill) => ({ text: skill }),
        );
        const skillsTemp = skills.map((skill) => skill.id);
        // const languagesTemp: Language[] = languages.map((lang) => ({
        //     id: lang.id,
        //     language: lang.language,
        //     level: lang.languageLevel,
        // }));

        return {
            languages,
            skills: skillsTemp,
            additionalSkills: additionalSkillsTemp,
            extraInfo: externalInfo ?? "",
        };
    }

    return {
        additionalSkills: [],
        skills: [],
        extraInfo: "",
        languages: [],
    };
};
