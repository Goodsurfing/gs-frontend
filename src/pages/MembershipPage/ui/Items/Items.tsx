import React, { FC } from "react";

import styles from "./Items.module.scss";

interface ItemsProps {
    image: string;
    title: string;
}

export const Items: FC<ItemsProps> = (props: ItemsProps) => {
    const { image, title } = props;
    return (
        <div className={styles.itemWrapper}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={title} />
            </div>
            <span className={styles.title}>{title}</span>
        </div>
    );
};
