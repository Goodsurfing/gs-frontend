import React, { FC, memo } from "react";

import styles from "./VolunteerPageContent.module.scss";

interface VolunteerPageContentProps {
    id: string;
}

export const VolunteerPageContent: FC<VolunteerPageContentProps> = memo((
    props: VolunteerPageContentProps,
) => {
    const { id } = props;
    return (
        <div className={styles.wrapper}>
            <VolunteerInfoCard />
        </div>
    );
});
