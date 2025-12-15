import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";

import styles from "./VolunteerPageContent.module.scss";
import { Text } from "@/shared/ui/Text/Text";
import { VolunteerInfoCard } from "@/entities/Volunteer/ui/VolunteerInfoCard/VolunteerInfoCard";
import { ProfileById } from "@/entities/Profile";

interface VolunteerPageContentProps {
    profileData?: ProfileById;
}

export const VolunteerPageContent: FC<VolunteerPageContentProps> = memo(
    (props: VolunteerPageContentProps) => {
        const { profileData } = props;
        const { t } = useTranslation("profile");

        if (!profileData) {
            return (
                <div className={styles.wrapper}>
                    <Text text={t("personal.Информация о пользователе ограничена, так как он не волонтёр")} />
                </div>
            );
        }

        return (
            <div className={styles.wrapper}>
                <VolunteerInfoCard profileData={profileData} className={styles.container} />
            </div>
        );
    },
);
