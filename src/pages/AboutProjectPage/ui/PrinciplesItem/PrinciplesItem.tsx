import React, { FC } from "react";
import styles from "./PrinciplesItem.module.scss";

interface PrinciplesItemProps {
    image: string;
    title: string;
    description: string;
}

export const PrinciplesItem: FC<PrinciplesItemProps> = (props: PrinciplesItemProps) => {
    const { image, title, description } = props;
    return (
        <div className={styles.wrapper}>
            <img src={image} alt={title} className={styles.circle} />
            <span className={styles.title}>{title}</span>
            <span className={styles.description}>{description}</span>
        </div>
    );
};
