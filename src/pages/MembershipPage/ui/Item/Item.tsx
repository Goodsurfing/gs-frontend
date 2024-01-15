import React, { FC } from "react";

import styles from "./Item.module.scss";

interface ItemProps {
    image: string;
    title: string;
}

export const Item: FC<ItemProps> = (props: ItemProps) => {
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
