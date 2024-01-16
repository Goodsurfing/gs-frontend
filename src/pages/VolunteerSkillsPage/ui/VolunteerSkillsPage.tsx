import React from "react";

import { useTranslation } from "react-i18next";
import { VolunteerSkillsForm } from "@/features/VolunteerSkills";

import styles from "./VolunteerSkillsPage.module.scss";

const VolunteerSkillsPage = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-skills.Навыки и умения")}</h2>
            <VolunteerSkillsForm />
        </div>
    );
};

export default VolunteerSkillsPage;
