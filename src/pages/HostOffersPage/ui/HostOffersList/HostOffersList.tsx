import React, { FC, memo, useMemo } from "react";

import image from "@/shared/assets/images/default-offer-image.svg";

import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import { MyOffers } from "@/entities/Offer";
import styles from "./HostOffersList.module.scss";

interface HostOffersListProps {
    offers?: MyOffers
}

export const HostOffersList: FC<HostOffersListProps> = memo((props: HostOffersListProps) => {
    const { offers } = props;
    const renderMyOffers = useMemo(() => {
        if (!offers || !offers.list || !offers.list.length) {
            return <span>Нет списка вакансий</span>;
        }

        return offers.list.map((offer, index) => (
            <HostOffersPageCard
                id={offer.id}
                title={offer.title}
                description={offer.description}
                image={image}
                location={offer.location}
                category={offer.category}
                rating={String(offer.rating)}
                likes={String(offer.likes)}
                reviews={String(offer.reviews)}
                went={String(offer.acceptedRequests)}
                status={offer.status}
                key={index}
            />
        ));
    }, [offers]);

    return (
        <div className={styles.wrapper}>
            {renderMyOffers}
        </div>
    );
});
