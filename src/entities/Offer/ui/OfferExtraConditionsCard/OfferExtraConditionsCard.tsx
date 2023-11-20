import React, { FC, memo } from "react";

import styles from "./OfferExtraConditionsCard.module.scss";

interface OfferExtraConditionsCardProps {
    extraConditions: string;
}

export const OfferExtraConditionsCard: FC<OfferExtraConditionsCardProps> = memo(
    (props: OfferExtraConditionsCardProps) => {
        const { extraConditions } = props;
        return (
            <div className={styles.wrapper}>
                <h3>Дополнительные условия</h3>
                <p className={styles.extraConditions}>{extraConditions}</p>
            </div>
        );
    },
);
