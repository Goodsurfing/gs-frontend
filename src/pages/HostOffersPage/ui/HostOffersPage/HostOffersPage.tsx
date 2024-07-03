import { useEffect, useState } from "react";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";
import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import {
    useGetMyOffers, useDeleteOfferMutation, Offer, useLazyGetMyOffers,
} from "@/entities/Offer";
import styles from "./HostOffersPage.module.scss";

const HostOffersPage = () => {
    const { data: offers, isLoading } = useGetMyOffers();
    const { data: offersLazyData, fetchOffers } = useLazyGetMyOffers();
    const [deleteOffer, { isLoading: isDeleteLoading }] = useDeleteOfferMutation();
    const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<Offer[] | undefined>();
    const [offersWithClosedStatus, setoffersWithClosedStatus] = useState<Offer[] | undefined>();

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

    useEffect(() => {
        setOffersWithOpenStatus(filterOffersByStatus(offers, "open"));
        setoffersWithClosedStatus(filterOffersByStatus(offers, "empty"));
    }, [offers]);

    const handleCloseClick = (offerId: number) => {
        setSelectedOffer(offerId);
    };

    const handleModalClose = () => {
        setSelectedOffer(null);
    };

    const handleConfirmClick = () => {
        if (selectedOffer) {
            deleteOffer(selectedOffer.toString()).unwrap()
                .then(() => {
                    fetchOffers();
                    setOffersWithOpenStatus(filterOffersByStatus(offersLazyData, "open"));
                    setoffersWithClosedStatus(filterOffersByStatus(offersLazyData, "empty"));
                    setSelectedOffer(null);
                });
        }
    };

    if (isLoading || isDeleteLoading) {
        return <Preloader />;
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.abilities}>Мои возможности</h2>
            <HostOffersList
                offers={offersWithOpenStatus}
                onCloseClick={(offerId) => handleCloseClick(offerId)}
            />
            {offersWithClosedStatus && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>Черновики</h2>
                    <div className={styles.cards}>
                        <HostOffersList
                            offers={offersWithClosedStatus}
                            onCloseClick={(offerId) => handleCloseClick(offerId)}
                        />
                    </div>
                </div>
            )}
            <AddOffer />
            {selectedOffer && (
                <ConfirmActionModal
                    description="Вы уверены что хотите удалить вакансию?"
                    onConfirm={() => handleConfirmClick()}
                    onClose={() => handleModalClose()}
                />
            )}
        </div>
    );
};

export default HostOffersPage;
