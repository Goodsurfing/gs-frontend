import React, {
    FC, memo,
} from "react";

import { useTranslation } from "react-i18next";
import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import { HostOffer } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./HostOffersList.module.scss";
import { useCategories } from "@/shared/data/categories";

interface HostOffersListProps {
    offers?: HostOffer[]
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
                id, status,
                averageRating, acceptedApplicationsCount, reviewsCount,
                address, title, shortDescription, categories, image,
            } = offer;
            const mediaObjectCover = getMediaContent(image?.contentUrl);

            return (
                <HostOffersPageCard
                    id={id}
                    title={title}
                    description={shortDescription}
                    image={mediaObjectCover}
                    location={address}
                    category={getTranslation(categories?.[0])}
                    rating={averageRating?.toString()}
                    reviews={reviewsCount?.toString()}
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
