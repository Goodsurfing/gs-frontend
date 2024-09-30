import { useCallback, useEffect, useState } from "react";

import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";

import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";
import {
    Offer,
    useLazyGetHostOffersByIdQuery,
    useLazyGetOfferByIdQuery,
} from "@/entities/Offer";
import { useUpdateOfferStatusMutation } from "@/entities/Offer/api/offerApi";

import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import { HostOffersList } from "../HostOffersList/HostOffersList";
import styles from "./HostOffersPage.module.scss";

type SeletecBtnType = "delete" | "every_open";

const HostOffersPage = () => {
    const { data: myHost } = useGetMyHostQuery();
    const myHostId = myHost?.id;
    const [updateOfferStatus] = useUpdateOfferStatusMutation();

    const [triggerHost, { isLoading, data: hostData }] = useLazyGetHostOffersByIdQuery();
    const [triggerOffer, {
        isLoading: isOfferLoading,
    }] = useLazyGetOfferByIdQuery();

    const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<Offer[]>(
        [],
    );
    const [offersWithClosedStatus, setoffersWithClosedStatus] = useState<
    Offer[]
    >([]);

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
    const [selectedBtnOffer, setSelectedBtnOffer] = useState<SeletecBtnType | null>(null);
    const isModalOpen = selectedOffer !== null && selectedBtnOffer !== null;

    const fetchOffers = useCallback(async () => {
        if (myHostId) {
            const result = await triggerHost(myHostId).unwrap();
            setOffersWithOpenStatus(filterOffersByStatus(result, "active"));
            setoffersWithClosedStatus(filterOffersByStatus(result, "draft"));
        }
    }, [myHostId, triggerHost]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    useEffect(() => {
        if (hostData) {
            setOffersWithOpenStatus(filterOffersByStatus(hostData, "active"));
            setoffersWithClosedStatus(filterOffersByStatus(hostData, "draft"));
        }
    }, [hostData]);

    const handleCloseClick = (offerId: number) => {
        setSelectedOffer(offerId);
        setSelectedBtnOffer("delete");
    };

    const handleEveryOpenClick = (offerId: number) => {
        setSelectedOffer(offerId);
        setSelectedBtnOffer("every_open");
    };

    const handleModalClose = () => {
        setSelectedOffer(null);
        setSelectedBtnOffer(null);
    };

    const handleConfirmClick = async () => {
        if (selectedOffer && selectedBtnOffer === "delete") {
            await triggerOffer(selectedOffer.toString()).unwrap()
                .then(async (result) => {
                    if (result) {
                        if (result.status === "active") {
                            await updateOfferStatus({
                                status: "disabled",
                                id: selectedOffer.toString(),
                            }).unwrap();
                        }
                        if (result.status === "disabled") {
                            await updateOfferStatus({
                                status: "active",
                                id: selectedOffer.toString(),
                            }).unwrap();
                        }
                    }
                });
        }
        setSelectedOffer(null);
        setSelectedBtnOffer(null);
    };

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.abilities}>Мои вакансии</h2>
            <HostOffersList
                offers={offersWithOpenStatus}
                onCloseClick={(offerId) => handleCloseClick(offerId)}
                onEveryOpenClick={(offerId) => handleEveryOpenClick(offerId)}
            />
            {!!offersWithClosedStatus.length && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>Черновики</h2>
                    <div className={styles.cards}>
                        <HostOffersList
                            offers={offersWithClosedStatus}
                            onCloseClick={(offerId) => handleCloseClick(offerId)}
                            onEveryOpenClick={(offerId) => handleEveryOpenClick(offerId)}
                        />
                    </div>
                </div>
            )}
            <AddOffer />
            <ConfirmActionModal
                isModalOpen={isModalOpen}
                description="Вы уверены что хотите изменить вакансию?"
                onConfirm={() => handleConfirmClick()}
                onClose={() => handleModalClose()}
                isLoading={isOfferLoading}
            />
        </div>
    );
};

export default HostOffersPage;
