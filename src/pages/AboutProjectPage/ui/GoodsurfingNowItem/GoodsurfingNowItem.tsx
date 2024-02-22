import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./GoodsurfingNowItem.module.scss";

interface GoodsurfingNowItemProps {
    title: string;
    description: string;
}

export const GoodsurfingNowItem: FC<GoodsurfingNowItemProps> = memo(
    (props: GoodsurfingNowItemProps) => {
        const { title, description } = props;
        const { t } = useTranslation("about-project");
        return (
            <div className={styles.wrapper}>
                <div className={styles.circle}>
                    <span className={styles.title}>{t(`${title}`)}</span>
                </div>
                <span className={styles.description}>{t(`${description}`)}</span>
            </div>
        );
    },
);
