import React, { FC } from "react";
import styles from "./OfferApplication.module.scss";

interface OfferApplicationProps {
    onChange?: () => void
}

export const OfferApplication: FC<OfferApplicationProps> = (props) => {
    const { onChange } = props;

    return (
        <div className={styles.wrapper}>OfferApplication</div>
    );
};
