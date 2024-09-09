import React, { FC, memo } from "react";

import { VolunteerApi, VolunteerInfoCard } from "@/entities/Volunteer";

import styles from "./VolunteerPageContent.module.scss";

interface VolunteerPageContentProps {
    volunteer: VolunteerApi;
}

export const VolunteerPageContent: FC<VolunteerPageContentProps> = memo(
    (props: VolunteerPageContentProps) => {
        const { volunteer } = props;
        return (
            <div className={styles.wrapper}>
                <VolunteerInfoCard volunteer={volunteer} className={styles.container} />
            </div>
        );
    },
);
