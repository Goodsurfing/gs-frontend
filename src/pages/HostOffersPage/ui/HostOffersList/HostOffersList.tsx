import React, {
    FC, memo, useMemo,
} from "react";

import image from "@/shared/assets/images/default-offer-image.svg";

import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import { Offer } from "@/entities/Offer";
import styles from "./HostOffersList.module.scss";

interface HostOffersListProps {
    offers?: Offer[]
    onCloseClick: (value: number) => void;
}

export const HostOffersList: FC<HostOffersListProps> = memo((props: HostOffersListProps) => {
    const { offers, onCloseClick } = props;

    const renderMyOffers = useMemo(() => {
        if (!offers || !offers.length) {
            return <span>Нет списка вакансий</span>;
        }

        return offers.map((offer, index) => (
            <HostOffersPageCard
                id={offer.id}
                title={`${offer?.description?.title}${offer.id}`}
                description={offer?.description?.description}
                image={image}
                location={offer?.where?.address}
                category="категория"
                rating="5"
                likes="4"
                reviews="2"
                went="8"
                status={offer.status}
                key={index}
                onCloseClick={() => onCloseClick(offer.id)}
            />
        ));
    }, [offers, onCloseClick]);

    return (
        <div className={styles.wrapper}>
            {renderMyOffers}
        </div>
    );
});
