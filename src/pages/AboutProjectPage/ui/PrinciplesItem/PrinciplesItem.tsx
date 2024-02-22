import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./PrinciplesItem.module.scss";

interface PrinciplesItemProps {
    title: string;
    description: string;
}

export const PrinciplesItem: FC<PrinciplesItemProps> = (props: PrinciplesItemProps) => {
    const { title, description } = props;
    const { t } = useTranslation("about-project");
    return (
        <div className={styles.wrapper}>
            <div className={styles.circle} />
            <span className={styles.title}>{t(`${title}`)}</span>
            <span className={styles.description}>{t(`${description}`)}</span>
        </div>
    );
};
