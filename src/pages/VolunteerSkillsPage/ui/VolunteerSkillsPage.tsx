import React from "react";

import { useTranslation } from "react-i18next";
import { VolunteerSkillsForm } from "@/features/VolunteerSkills";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./VolunteerSkillsPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const VolunteerSkillsPage = () => {
    const { t, ready } = useTranslation("volunteer");
    const { locale } = useLocale();
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
                <VolunteerSkillsForm profileData={profileData} locale={locale} />
            )}
        </div>
    );
};

export default VolunteerSkillsPage;
