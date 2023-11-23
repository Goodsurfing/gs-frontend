import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./VolunteerSkillsPage.module.scss";
import { VolunteerSkillsForm } from "@/features/VolunteerSkills";

const VolunteerSkillsPage = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.wrapper}>
            <h2>Навыки и умения</h2>
            <VolunteerSkillsForm />
        </div>
    );
};

export default VolunteerSkillsPage;
