import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { OfferDescription } from "../../model/types/offerDescription";
import styles from "./OfferDescriptionCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";

interface OfferDescriptionCardProps {
    className?: string;
    description: OfferDescription;
}

export const OfferDescriptionCard: FC<OfferDescriptionCardProps> = memo(
    (props: OfferDescriptionCardProps) => {
        const { className, description } = props;
        const { t } = useTranslation("offer");

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.container}>
                    <Text title={t("personalOffer.Описание")} titleSize="h3" />
                    <p className={styles.description}>
                        {description.description}
                    </p>
                </div>
                <div className={styles.container}>
                    <Text title={t("personalOffer.Дополнительная информация")} titleSize="h3" />
                    <p className={styles.description}>
                        {description.shortDescription}
                    </p>
                </div>
            </div>
        );
    },
);
