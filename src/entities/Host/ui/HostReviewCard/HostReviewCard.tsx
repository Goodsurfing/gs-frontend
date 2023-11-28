import React, { FC, memo, useMemo } from "react";
import cn from "classnames";

import styles from "./HostReviewCard.module.scss";

interface HostReviewCardProps {
    className?: string;
}

export const HostReviewCard: FC<HostReviewCardProps> = memo((props: HostReviewCardProps) => {
    const { className } = props;

    // Add render ReviewCards and dependencies
    const renderCards = useMemo(() => {}, []);

    return (
        <div className={cn(className, styles.wrapper)}>
            <h3>Отзывы об организации</h3>
            <div className={styles.container}>{renderCards}</div>
        </div>
    );
});
