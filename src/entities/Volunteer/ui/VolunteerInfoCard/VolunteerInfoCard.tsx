import React, { FC, memo } from "react";

import { Volunteer } from "../../model/types/volunteer";
import styles from "./VolunteerInfoCard.module.scss";
import { VolunteerDesctiptionCard } from "../VolunteerDesctiptionCard/VolunteerDesctiptionCard";

interface VolunteerInfoCardProps {
    volunteer: Volunteer;
}

export const VolunteerInfoCard: FC<VolunteerInfoCardProps> = memo(
    (props: VolunteerInfoCardProps) => {
        const { volunteer } = props;
        return (
            <div className={styles.wrapper}>
                <VolunteerDesctiptionCard description={volunteer.aboutMe} />
            </div>
        );
    },
);
