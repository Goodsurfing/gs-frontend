import React, { memo, useMemo } from "react";

import image from "@/shared/assets/images/default-offer-image.svg";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import styles from "./HostOffersList.module.scss";
import { useGetMyOffersQuery } from "@/entities/Offer/api/offerApi";
import Preloader from "@/shared/ui/Preloader/Preloader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";

export const HostOffersList = memo(() => {
    const {
        data: offers, isLoading, isError,
    } = useGetMyOffersQuery();

    const renderMyOffers = useMemo(() => {
        if (!offers) {
            return <span>Нет списка вакансий</span>;
        }

        return offers.list.map((offer, index) => (
            <HostOffersPageCard
                id={String(index)}
                title={offer.title}
                description="Здесь будет описание"
                image={image}
                location="Казань, Россия"
                category="Работа с животными"
                rating={String(offer.rating)}
                likes={String(offer.likes)}
                reviews={String(offer.reviews)}
                went={String(offer.acceptedRequests)}
                key={index}
            />
        ));
    }, [offers]);

    if (isLoading) {
        return <Preloader className={styles.wrapperPreloader} preloader={styles.preloader} />;
    }

    return (
        <div className={styles.wrapper}>
            {isError && <HintPopup text="Ошибка вывода списка вакансий" type={HintType.Error} />}
            {renderMyOffers}
        </div>
    );
});
