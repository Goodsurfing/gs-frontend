import React, { FC, memo } from "react";

import { Languages } from "../../model/types/offerWhoNeeds";
import styles from "./OfferLanguages.module.scss";

interface OfferLanguagesCardProps {
    languages: Languages;
}

export const OfferLanguagesCard: FC<OfferLanguagesCardProps> = memo(
    (props: OfferLanguagesCardProps) => {
        const { languages } = props;
        return (
            <div className={styles.wrapper}>
                <h3 className={styles.title}>Владение языками</h3>
                <span className={styles.languages}>{languages}</span>
            </div>
        );
    },
);
