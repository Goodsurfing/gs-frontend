import React, { FC, memo } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import styles from "./OfferExtraConditionsCard.module.scss";

interface OfferExtraConditionsCardProps {
    extraConditions: string;
    className?: string;
}

export const OfferExtraConditionsCard: FC<OfferExtraConditionsCardProps> = memo(
    (props: OfferExtraConditionsCardProps) => {
        const { extraConditions, className } = props;
        const { t } = useTranslation("offer");
        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalOffer.Дополнительные условия")}</h3>
                <p className={styles.extraConditions}>{extraConditions}</p>
            </div>
        );
    },
);
