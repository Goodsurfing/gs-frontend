import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { OfferCard, useGetHostOffersByIdQuery } from "@/entities/Offer";

import styles from "./HostOffersCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useCategories } from "@/shared/data/categories";

interface HostOffersCardProps {
    className?: string;
    hostId: string;
}

export const HostOffersCard: FC<HostOffersCardProps> = memo(
    (props: HostOffersCardProps) => {
        const { className, hostId } = props;
        const { t } = useTranslation("host");
        const { getTranslation } = useCategories();
        const { data: hostOffers, isError } = useGetHostOffersByIdQuery(hostId);

        const renderOffers = useMemo(
            () => {
                if (!hostOffers) return null;

                return hostOffers
                    .slice(0, 3)
                    .map(({ description, where }, index) => (
                        <OfferCard
                            image={getMediaContent(description?.image)}
                            title={description?.title}
                            description={description?.shortDescription}
                            location={where?.address}
                            category={getTranslation(description?.categoryIds[0])}
                            rating="4.3"
                            likes="10"
                            reviews="14"
                            went="22"
                            key={index}
                        />
                    ));
            },
            [getTranslation, hostOffers],
        );

        if (!hostOffers || isError) {
            return null;
        }

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalHost.Вакансии")}</h3>
                <div className={styles.container}>{renderOffers}</div>
            </div>
        );
    },
);
