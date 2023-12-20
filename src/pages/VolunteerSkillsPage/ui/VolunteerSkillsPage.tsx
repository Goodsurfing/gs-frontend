import React from "react";

import { VolunteerSkillsForm } from "@/features/VolunteerSkills";

import styles from "./VolunteerSkillsPage.module.scss";

const VolunteerSkillsPage = () => (
    <div className={styles.wrapper}>
        <h2>Навыки и умения</h2>
        <VolunteerSkillsForm />
    </div>
);

export default VolunteerSkillsPage;
