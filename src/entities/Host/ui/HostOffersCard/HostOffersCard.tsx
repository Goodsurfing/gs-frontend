import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { Offer, OfferCard } from "@/entities/Offer";

import offerDefaultImage from "@/shared/assets/images/default-offer-image.svg";

import styles from "./HostOffersCard.module.scss";

interface HostOffersCardProps {
    className?: string;
    offers: Offer[];
}

export const HostOffersCard: FC<HostOffersCardProps> = memo(
    (props: HostOffersCardProps) => {
        const { className, offers } = props;
        const { t } = useTranslation("host");

        const renderOffers = useMemo(
            () => {
                if (!offers) return "У организации пока нет вакансий";

                return offers
                    .slice(0, 3)
                    .map(({ description }, index) => (
                        <OfferCard
                            image={offerDefaultImage}
                            title={description?.title}
                            description={description?.shortDescription}
                            location="Казань, Россия"
                            category="Заповедники и нац. парки"
                            rating="4.3"
                            likes="10"
                            reviews="14"
                            went="22"
                            key={index}
                        />
                    ));
            },
            [offers],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalHost.Вакансии")}</h3>
                <div className={styles.container}>{renderOffers}</div>
            </div>
        );
    },
);
