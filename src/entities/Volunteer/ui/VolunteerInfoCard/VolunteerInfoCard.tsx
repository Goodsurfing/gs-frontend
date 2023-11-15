import React, { FC, memo } from "react";

import { Volunteer } from "../../model/types/volunteer";
import styles from "./VolunteerInfoCard.module.scss";

interface VolunteerInfoCardProps {
    volunteer: Volunteer;
}

export const VolunteerInfoCard: FC<VolunteerInfoCardProps> = memo(
    (props: VolunteerInfoCardProps) => {
        const { volunteer } = props;
        return <div className={styles.wrapper}>VolunteerInfoCard</div>;
    },
);
