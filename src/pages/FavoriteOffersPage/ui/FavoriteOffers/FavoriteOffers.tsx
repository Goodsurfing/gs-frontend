import cn from "classnames";
import React, { FC } from "react";

import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import Button from "@/shared/ui/Button/Button";
import emptyIcon from "@/shared/assets/icons/empty-favorite-heart.svg";

import styles from "./FavoriteOffers.module.scss";
import { getOffersMapPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Offer } from "@/entities/Offer";
import { OfferCard } from "@/widgets/OffersMap";

interface FavoriteOffersProps {
    className?: string;
}

export const FavoriteOffers: FC<FavoriteOffersProps> = (props) => {
    const { className } = props;
    const navigate = useNavigate();
    const { locale } = useLocale();

    const viewOffersClick = () => {
        navigate(getOffersMapPageUrl(locale));
    };

    if (mockedOffersData) {
        return (
            <div className={styles.empty}>
                <p>
                    Вы пока не добавили ни одну вакансию в избранное, давайте
                    это исправим?
                </p>
                <Button
                    className={styles.viewOffers}
                    color="BLUE"
                    size="SMALL"
                    variant="OUTLINE"
                    onClick={viewOffersClick}
                >
                    Посмотреть вакансии
                </Button>
                <ReactSVG src={emptyIcon} className={styles.emptyIcon} />
            </div>
        );
    }

    const renderOffers = (offers: Offer[]) => offers.map((offer) => (
        <OfferCard
            classNameCard={styles.offerCard}
            className={cn(styles.offer)}
            status="opened"
            data={offer}
            key={offer.id}
        />
    ));

    return (
        <div className={cn(styles.wrapper, className)}>
            {renderOffers(mockedOffersData)}
        </div>
    );
};
