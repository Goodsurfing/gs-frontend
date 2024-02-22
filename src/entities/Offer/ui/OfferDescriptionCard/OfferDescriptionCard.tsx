import cn from "classnames";
import React, { FC, memo } from "react";

import { OfferDescription } from "../../model/types/offerDescription";
import styles from "./OfferDescriptionCard.module.scss";

interface OfferDescriptionCardProps {
    className?: string;
    description: OfferDescription;
}

export const OfferDescriptionCard: FC<OfferDescriptionCardProps> = memo(
    (props: OfferDescriptionCardProps) => {
        const { className, description } = props;

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.container}>
                    <h3 className={styles.title}>Описание</h3>
                    <p className={styles.description}>
                        {description.longDescription}
                    </p>
                </div>
                <div className={styles.container}>
                    <h3 className={styles.title}>Дополнительная информация</h3>
                    <p className={styles.description}>
                        {description.shortDescription}
                    </p>
                </div>
            </div>
        );
    },
);
