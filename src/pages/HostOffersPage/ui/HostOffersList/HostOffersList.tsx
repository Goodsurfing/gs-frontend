import React, {
    FC, memo,
} from "react";

import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import { Offer } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./HostOffersList.module.scss";
import { useCategories } from "@/shared/data/categories";

interface HostOffersListProps {
    offers?: Offer[]
    onCloseClick: (value: number) => void;
    onEveryOpenClick: (value: number) => void;
}

export const HostOffersList: FC<HostOffersListProps> = memo((props: HostOffersListProps) => {
    const {
        offers, onCloseClick, onEveryOpenClick,
    } = props;
    const { getTranslation } = useCategories();

    const renderMyOffers = () => {
        if (!offers || !offers.length) {
            return <span>Нет списка вакансий</span>;
        }

        return offers.map((offer, index) => {
            const mediaObjectCover = getMediaContent(offer.description?.image);
            return (
                <HostOffersPageCard
                    id={offer.id}
                    title={offer?.description?.title}
                    description={offer?.description?.shortDescription}
                    image={mediaObjectCover}
                    location={offer?.where?.address}
                    category={getTranslation(offer.description?.categoryIds[0])}
                    rating="5"
                    likes="4"
                    reviews="2"
                    went="8"
                    status={offer.status}
                    key={index}
                    onCloseClick={() => onCloseClick(offer.id)}
                    onEveryOpenClick={() => onEveryOpenClick(offer.id)}
                    isEveryOpenActive={offer.status === "every_open"}
                />
            );
        });
    };

    return (
        <div className={styles.wrapper}>
            {renderMyOffers()}
        </div>
    );
});
