import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Offer } from "@/entities/Offer";

import styles from "./HostDescriptionCard.module.scss";

interface HostOffersCardProps {
    className?: string;
    offers: Offer[];
}

export const HostOffersCard: FC<HostOffersCardProps> = memo(
    (props: HostOffersCardProps) => {
        const { className, offers } = props;

        const renderOffers = useMemo(
            () => offers
                .slice(0, 3)
                .map((offer, index) => (
                    <OfferCard offer={offer} key={index} />
                )),
            [offers],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Вакансии</h3>
                <div className={styles.container}>{renderOffers}</div>
            </div>
        );
    },
);
