import React, { FC, memo } from "react";

import styles from "./GoodsurfingStatsItem.module.scss";

interface GoodsurfingStatsItemProps {
    title: string;
    description: string;
}

export const GoodsurfingStatsItem: FC<GoodsurfingStatsItemProps> = memo(
    (props: GoodsurfingStatsItemProps) => {
        const { title, description } = props;

        return (
            <div className={styles.wrapper}>
                <div className={styles.circle}>
                    <span className={styles.title}>{title}</span>
                </div>
                <span className={styles.description}>{description}</span>
            </div>
        );
    },
);
