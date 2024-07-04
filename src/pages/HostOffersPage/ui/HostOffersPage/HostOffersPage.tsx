import { useCallback, useEffect, useState } from "react";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";
import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import {
    useDeleteOfferMutation, Offer,
    useLazyGetHostOffersByIdQuery,
} from "@/entities/Offer";
import styles from "./HostOffersPage.module.scss";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";

const HostOffersPage = () => {
    const { data: myHost } = useGetMyHostQuery();
    const myHostId = myHost?.id;
    const [deleteOffer, { isLoading: isDeleteLoading }] = useDeleteOfferMutation();
    const [trigger, { isLoading, data }] = useLazyGetHostOffersByIdQuery();

    const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<Offer[]>([]);
    const [offersWithClosedStatus, setoffersWithClosedStatus] = useState<Offer[]>([]);

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

    const fetchOffers = useCallback(async () => {
        if (myHostId) {
            const result = await trigger(myHostId).unwrap();
            setOffersWithOpenStatus(filterOffersByStatus(result, "open"));
            setoffersWithClosedStatus(filterOffersByStatus(result, "empty"));
        }
    }, [myHostId, trigger]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    useEffect(() => {
        if (data) {
            setOffersWithOpenStatus(filterOffersByStatus(data, "open"));
            setoffersWithClosedStatus(filterOffersByStatus(data, "empty"));
        }
    }, [data]);

    const handleCloseClick = (offerId: number) => {
        setSelectedOffer(offerId);
    };

    const handleModalClose = () => {
        setSelectedOffer(null);
    };

    const handleConfirmClick = async () => {
        if (selectedOffer) {
            await deleteOffer(selectedOffer.toString());
            setSelectedOffer(null);
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
            {offersWithClosedStatus.length && (
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
