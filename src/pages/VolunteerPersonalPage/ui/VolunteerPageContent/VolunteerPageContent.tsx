import React, { FC, memo } from "react";

import styles from "./VolunteerPageContent.module.scss";
import { VolunteerInfoCard } from "@/entities/Volunteer";
import { mockedVolunteerData } from "@/entities/Volunteer/model/data/mockedVolunteerData";

interface VolunteerPageContentProps {
    id: string;
}

export const VolunteerPageContent: FC<VolunteerPageContentProps> = memo((
    props: VolunteerPageContentProps,
) => {
    const { id } = props;
    return (
        <div className={styles.wrapper}>
            <VolunteerInfoCard volunteer={mockedVolunteerData} />
        </div>
    );
});
