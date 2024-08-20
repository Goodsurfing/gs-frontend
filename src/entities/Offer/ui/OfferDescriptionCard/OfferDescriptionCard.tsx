import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { OfferDescription } from "../../model/types/offerDescription";
import styles from "./OfferDescriptionCard.module.scss";

interface OfferDescriptionCardProps {
    className?: string;
    description: OfferDescription;
}

export const OfferDescriptionCard: FC<OfferDescriptionCardProps> = memo(
    (props: OfferDescriptionCardProps) => {
        const { className, description } = props;
        const { t } = useTranslation("offer");

        return (
            <div className={cn(className, styles.wrapper)} id="description">
                <div className={styles.container}>
                    <h3 className={styles.title}>{t("personalOffer.Описание")}</h3>
                    <p className={styles.description}>
                        {description.description}
                    </p>
                </div>
                <div className={styles.container}>
                    <h3 className={styles.title}>{t("personalOffer.Дополнительная информация")}</h3>
                    <p className={styles.description}>
                        {description.shortDescription}
                    </p>
                </div>
            </div>
        );
    },
);
