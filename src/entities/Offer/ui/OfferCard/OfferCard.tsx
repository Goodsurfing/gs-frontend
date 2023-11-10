import React, { FC, memo } from "react";

import styles from "./OfferCard.module.scss";
import { Offer } from "../../model/types/offer";

interface OfferCardProps {
    offer: Offer;
}

export const OfferCard:FC<OfferCardProps> = ((props: OfferCardProps) => {
    const { offer } = props;

    return (
        <div className={styles.wrapper}>
            <img src={}/>
        </div>
    );
});
