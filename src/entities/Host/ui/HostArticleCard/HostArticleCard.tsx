import React, { FC, memo, useMemo } from "react";

import cn from "classnames";
import styles from "./HostArticleCard.module.scss";

interface HostArticleCardProps {
    className?: string;
}

export const HostArticleCard: FC<HostArticleCardProps> = memo((props: HostArticleCardProps) => {
    const { className } = props;
    // Add render ArticlesCards
    const renderCards = useMemo(() => {}, []);

    return (
        <div className={cn(className, styles.wrapper)}>
            <h3>Статьи об организации</h3>
            <div className={styles.container}>{renderCards}</div>
        </div>
    );
});
