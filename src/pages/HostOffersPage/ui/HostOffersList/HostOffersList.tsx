import React, { memo, useMemo, useState } from "react";

import { Offer } from "@/entities/Offer";
import image from "@/shared/assets/images/default-offer-image.svg";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import styles from "./HostOffersList.module.scss";

export const HostOffersList = memo(() => {
    const [offersData] = useState<Offer[]>(mockedOffersData);

    const renderMyOffers = useMemo(() => offersData.map((offer) => (
        <HostOffersPageCard
            id={offer.id}
            title={offer.description.title}
            description={offer.description.shortDescription}
            image={image}
            location="Казань, Россия"
            category="Работа с животными"
            rating="4.3"
            likes="10"
            reviews="14"
            went="22"
            key={offer.id}
        />
    )), [offersData]);

    return <div className={styles.wrapper}>{renderMyOffers}</div>;
});
