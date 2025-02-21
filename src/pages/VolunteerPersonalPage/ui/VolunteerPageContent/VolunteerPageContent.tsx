import React, { FC, memo } from "react";

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

        if (!volunteer) {
            return (
                <div className={styles.wrapper}>
                    <Text text="Информация о пользователе ограничена, так как он не волонтёр" />
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
