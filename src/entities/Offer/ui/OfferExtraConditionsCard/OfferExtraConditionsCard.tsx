import React, { FC, memo } from "react";
import cn from "classnames";
import styles from "./OfferExtraConditionsCard.module.scss";

interface OfferExtraConditionsCardProps {
    extraConditions: string;
    className?: string;
}

export const OfferExtraConditionsCard: FC<OfferExtraConditionsCardProps> = memo(
    (props: OfferExtraConditionsCardProps) => {
        const { extraConditions, className } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Дополнительные условия</h3>
                <p className={styles.extraConditions}>{extraConditions}</p>
            </div>
        );
    },
);
