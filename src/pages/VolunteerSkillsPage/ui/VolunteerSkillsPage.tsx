import React from "react";

import { useTranslation } from "react-i18next";
import { VolunteerSkillsForm } from "@/features/VolunteerSkills";

import styles from "./VolunteerSkillsPage.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { useGetProfileInfoQuery } from "@/entities/Profile";

const VolunteerSkillsPage = () => {
    const { t, ready } = useTranslation("volunteer");
    const { data: profileData, isLoading } = useGetProfileInfoQuery();

    if (!ready || isLoading) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-skills.Навыки и умения")}</h2>
            {profileData?.id && (
                <VolunteerSkillsForm profileId={profileData.id} />
            )}
        </div>
    );
};

export default VolunteerSkillsPage;
