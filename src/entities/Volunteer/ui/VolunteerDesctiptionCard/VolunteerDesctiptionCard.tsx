import React, { FC, memo } from "react";

import styles from "./VolunteerDesctiptionCard.module.scss";

interface VolunteerDesctiptionCardProps {
    description?: string;
}

export const VolunteerDesctiptionCard: FC<VolunteerDesctiptionCardProps> = memo(
    (props: VolunteerDesctiptionCardProps) => {
        const { description } = props;
        return (
            <div>
                <h3>О себе</h3>
                <p className={styles.description}>{description || "Волонтёр не указал информацию о себе"}</p>
            </div>
        );
    },
);
