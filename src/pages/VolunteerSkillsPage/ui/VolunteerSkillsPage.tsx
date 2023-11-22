import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./VolunteerSkillsPage.module.scss";
import { SkillsForm } from "@/features/SkillsForm";

const VolunteerSkillsPage = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.wrapper}>
            <h3>Навыки и умения</h3>
            <SkillsForm />
        </div>
    );
};

export default VolunteerSkillsPage;
