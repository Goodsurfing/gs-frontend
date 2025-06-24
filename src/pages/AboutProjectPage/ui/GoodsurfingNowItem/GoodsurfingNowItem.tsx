import React, { FC, memo } from "react";

import styles from "./GoodsurfingNowItem.module.scss";

interface GoodsurfingNowItemProps {
    title: string;
    description: string;
}

export const GoodsurfingNowItem: FC<GoodsurfingNowItemProps> = memo(
    (props: GoodsurfingNowItemProps) => {
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
