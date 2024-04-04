import React, { FC } from "react";
import styles from "./OfferBalloon.module.scss";

interface OfferBalloonProps {
    title: string;
    cover: string;
}

export const OfferBalloon: FC<OfferBalloonProps> = (props) => {
    const { title, cover } = props;
    return (
        <div className={styles.wrapper}>
            <img src={cover} alt="offer-cover" className={styles.cover} />
            <span className={styles.title}>{title}</span>
        </div>
    );
};
