import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Offer, OfferCard } from "@/entities/Offer";

import offerDefaultImage from "@/shared/assets/images/default-offer-image.svg";

import styles from "./VolunteerOffersCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface VolunteerOffersCardProps {
    className?: string;
    offers?: Offer[];
}

const RENDER_THREE_CARDS = [0, 3];

export const VolunteerOffersCard: FC<VolunteerOffersCardProps> = memo(
    (props: VolunteerOffersCardProps) => {
        const { className, offers } = props;
        const { locale } = useLocale();

        const renderOffers = useMemo(
            () => {
                if (!offers) return "У организации пока нет вакансий";

                return offers
                    .slice(...RENDER_THREE_CARDS)
                    .map(({ description, id }, index) => (
                        <OfferCard
                            isFavoriteIconShow={false}
                            handleFavoriteClick={() => {}}
                            locale={locale}
                            isFavorite={false}
                            offerId={id}
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
            [locale, offers],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Вакансии</h3>
                <div className={styles.container}>{renderOffers}</div>
            </div>
        );
    },
);
