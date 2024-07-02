import React, {
    FC, memo, useMemo, useState,
} from "react";

import image from "@/shared/assets/images/default-offer-image.svg";

import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";
import { Offer } from "@/entities/Offer";
import styles from "./HostOffersList.module.scss";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";

interface HostOffersListProps {
    offers?: Offer[]
}

export const HostOffersList: FC<HostOffersListProps> = memo((props: HostOffersListProps) => {
    const { offers } = props;
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

    const handleCloseClick = () => {
        setModalOpen((prev) => !prev);
    };

    const handleConfirmClick = (offerId: number) => {

    };
    const renderMyOffers = useMemo(() => {
        if (!offers || !offers.length) {
            return <span>Нет списка вакансий</span>;
        }

        return offers.map((offer, index) => (
            <HostOffersPageCard
                id={offer.id}
                title={offer?.description?.title}
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
                onCloseClick={handleCloseClick}
            />
        ));
    }, [offers]);

    return (
        <div className={styles.wrapper}>
            {renderMyOffers}
            <ConfirmActionModal
                description="Вы уверены что хотите удалить вакансию?"
                onClose={handleCloseClick}
                onConfirm={handleConfirmClick}
            />
        </div>
    );
});
