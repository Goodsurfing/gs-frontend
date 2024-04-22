import { useTranslation } from "react-i18next";
import {
    adminIcon,
    artIcon,
    cookingIcon,
    decorIcon,
    driveIcon,
    farmingIcon,
    gardeningIcon,
    housekeepingIcon,
    musicIcon,
    nightJobIcon,
    photographyIcon,
    socialIcon,
    sportIcon,
    tourismIcon,
    videoIcon,
} from "../icons/skills";

export type Skills = | "admin" | "cooking" | "driving" | "housing" | "decor"
| "tourism" | "art" | "farming" | "social" | "recording" | "gardening"
| "music" | "photo" | "night_job" | "sport";

export type SkillsData = {
    id: Skills;
    text: string;
    icon: string;
};

export const useSkillsData = () => {
    const { t } = useTranslation("translation");
    const skillsData: SkillsData[] = [{
        id: "admin",
        icon: adminIcon,
        text: t("skills.admin"),
    }, {
        id: "cooking",
        icon: cookingIcon,
        text: t("skills.cooking"),
    }, {
        id: "driving",
        icon: driveIcon,
        text: t("skills.driving"),
    }, {
        id: "housing",
        icon: housekeepingIcon,
        text: t("skills.housing"),
    }, {
        id: "decor",
        icon: decorIcon,
        text: t("skills.decor"),
    }, {
        id: "tourism",
        icon: tourismIcon,
        text: t("skills.tourism"),
    }, {
        id: "art",
        icon: artIcon,
        text: t("skills.art"),
    }, {
        id: "farming",
        icon: farmingIcon,
        text: t("skills.farming"),
    }, {
        id: "social",
        icon: socialIcon,
        text: t("skills.social"),
    }, {
        id: "recording",
        icon: videoIcon,
        text: t("skills.recording"),
    }, {
        id: "gardening",
        icon: gardeningIcon,
        text: t("skills.gardening"),
    }, {
        id: "music",
        icon: musicIcon,
        text: t("skills.music"),
    }, {
        id: "photo",
        icon: photographyIcon,
        text: t("skills.photo"),
    }, {
        id: "night_job",
        icon: nightJobIcon,
        text: t("skills.night_job"),
    }, {
        id: "sport",
        icon: sportIcon,
        text: t("skills.sport"),
    }];
    return { skillsData };
};
