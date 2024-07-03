import { useCallback, useEffect, useState } from "react";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";
import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import {
    useGetMyOffers, useDeleteOfferMutation, Offer, useLazyGetMyOffers,
    useLazyGetHostOffersByIdQuery,
    useGetHostOffersByIdQuery,
} from "@/entities/Offer";
import styles from "./HostOffersPage.module.scss";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";

const HostOffersPage = () => {
    const [deleteOffer, { isLoading: isDeleteLoading }] = useDeleteOfferMutation();
    const { data: myHost } = useGetMyHostQuery();
    const myHostId = myHost?.id;
    const [trigger, { isLoading }] = useLazyGetHostOffersByIdQuery();
    const [offersData, setOffersData] = useState<Offer[]>();

    // const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<Offer[] | undefined>(filterOffersByStatus(offers, "open"));
    // const [offersWithClosedStatus, setoffersWithClosedStatus] = useState<Offer[] | undefined>(filterOffersByStatus(offers, "empty"));

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

    const fetchOffers = useCallback(async () => {
        if (myHostId) {
            const result = await trigger(myHostId).unwrap();
            setOffersData(result);
        }
    }, [myHostId, trigger]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleCloseClick = (offerId: number) => {
        setSelectedOffer(offerId);
    };

    const handleModalClose = () => {
        setSelectedOffer(null);
    };

    const handleConfirmClick = async () => {
        if (selectedOffer) {
            await deleteOffer(selectedOffer.toString());
            fetchOffers();
        }
    };

    if (isLoading || isDeleteLoading) {
        return <Preloader />;
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.abilities}>Мои возможности</h2>
            <HostOffersList
                offers={offersData}
                onCloseClick={(offerId) => handleCloseClick(offerId)}
            />
            {/* {offersWithClosedStatus && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>Черновики</h2>
                    <div className={styles.cards}>
                        <HostOffersList
                            offers={offersWithClosedStatus}
                            onCloseClick={(offerId) => handleCloseClick(offerId)}
                        />
                    </div>
                </div>
            )} */}
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
