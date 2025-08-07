import React, { FC } from "react";
import styles from "./PrinciplesItem.module.scss";

interface PrinciplesItemProps {
    title: string;
    description: string;
}

export const PrinciplesItem: FC<PrinciplesItemProps> = (props: PrinciplesItemProps) => {
    const { title, description } = props;
    return (
        <div className={styles.wrapper}>
            <div className={styles.circle} />
            <span className={styles.title}>{title}</span>
            <span className={styles.description}>{description}</span>
        </div>
    );
};
