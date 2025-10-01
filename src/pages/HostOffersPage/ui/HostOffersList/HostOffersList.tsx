import React, {
    FC, memo,
} from "react";

import { useTranslation } from "react-i18next";
import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import { Offer } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./HostOffersList.module.scss";
import { useCategories } from "@/shared/data/categories";

interface HostOffersListProps {
    offers?: Offer[]
    onCloseClick: (value: number) => void;
    onDeleteClick: (value: number) => void;
    // onEveryOpenClick: (value: number) => void;
}

export const HostOffersList: FC<HostOffersListProps> = memo((props: HostOffersListProps) => {
    const {
        offers, onCloseClick, onDeleteClick,
    } = props;
    const { getTranslation } = useCategories();
    const { t } = useTranslation("host");

    const renderMyOffers = () => {
        if (!offers || !offers.length) {
            return <span>{t("hostOffers.Нет списка вакансий")}</span>;
        }

        return offers.map((offer, index) => {
            const {
                id, description, where, status,
                averageRating, acceptedApplicationsCount, feedbacksCount,
            } = offer;
            const mediaObjectCover = getMediaContent(description?.image, "MEDIUM");

            return (
                <HostOffersPageCard
                    id={id}
                    title={description?.title}
                    description={description?.shortDescription}
                    image={mediaObjectCover}
                    location={where?.address}
                    category={getTranslation(description?.categoryIds[0])}
                    rating={averageRating?.toString()}
                    reviews={feedbacksCount?.toString()}
                    went={acceptedApplicationsCount.toString()}
                    status={status}
                    key={index}
                    onCloseClick={() => onCloseClick(id)}
                    onDeleteClick={() => onDeleteClick(id)}
                    isCloseButtonActive={status !== "disabled"}
                    // onEveryOpenClick={() => onEveryOpenClick(offer.id)}
                    // isEveryOpenActive
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
