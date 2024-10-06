import React, { FC, memo } from "react";

import { VolunteerApi, VolunteerInfoCard } from "@/entities/Volunteer";

import styles from "./VolunteerPageContent.module.scss";
import { Host } from "@/entities/Host";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerPageContentProps {
    volunteer?: VolunteerApi;
    host?: Host;
}

export const VolunteerPageContent: FC<VolunteerPageContentProps> = memo(
    (props: VolunteerPageContentProps) => {
        const { volunteer, host } = props;

        if (!volunteer && !host) {
            return (
                <div className={styles.wrapper}>
                    <Text text="Информация о пользователе ограничена, так как он не волонтёр или организатор" />
                </div>
            );
        }

        return (
            <div className={styles.wrapper}>
                <VolunteerInfoCard volunteer={volunteer} className={styles.container} host={host} />
            </div>
        );
    },
);
