import React from "react";

import { useTranslation } from "react-i18next";
import { VolunteerSkillsForm } from "@/features/VolunteerSkills";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./VolunteerSkillsPage.module.scss";

const VolunteerSkillsPage = () => {
    const { t, ready } = useTranslation("volunteer");
    const { data: profileData, isLoading } = useGetProfileInfoQuery();

    if (!ready || isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
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
