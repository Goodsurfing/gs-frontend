import React, { FC, memo } from "react";

import { VolunteerInfoCard } from "@/entities/Volunteer";
import { mockedVolunteerData } from "@/entities/Volunteer/model/data/mockedVolunteerData";

import styles from "./VolunteerPageContent.module.scss";

interface VolunteerPageContentProps {
    id: string;
}

export const VolunteerPageContent: FC<VolunteerPageContentProps> = memo(
    (props: VolunteerPageContentProps) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id } = props;
        return (
            <div className={styles.wrapper}>
                <VolunteerInfoCard volunteer={mockedVolunteerData} className={styles.container} />
            </div>
        );
    },
);
