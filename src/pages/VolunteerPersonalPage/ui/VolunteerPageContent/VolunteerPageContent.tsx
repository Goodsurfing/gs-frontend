import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { VolunteerApi } from "@/entities/Volunteer";

import styles from "./VolunteerPageContent.module.scss";
import { Text } from "@/shared/ui/Text/Text";
import { VolunteerInfoCard } from "@/entities/Volunteer/ui/VolunteerInfoCard/VolunteerInfoCard";

interface VolunteerPageContentProps {
    volunteer?: VolunteerApi;
}

export const VolunteerPageContent: FC<VolunteerPageContentProps> = memo(
    (props: VolunteerPageContentProps) => {
        const { volunteer } = props;
        const { t } = useTranslation("volunteer");

        if (!volunteer) {
            return (
                <div className={styles.wrapper}>
                    <Text text={t("personalVolunteer.Информация о пользователе ограничена, так как он не волонтёр")} />
                </div>
            );
        }

        return (
            <div className={styles.wrapper}>
                <VolunteerInfoCard volunteer={volunteer} className={styles.container} />
            </div>
        );
    },
);
