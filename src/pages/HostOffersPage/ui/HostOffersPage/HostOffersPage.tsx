import { useCallback, useEffect, useState } from "react";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";
import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import {
    useDeleteOfferMutation, Offer,
    useLazyGetHostOffersByIdQuery,
    useUpdateOfferMutation,
    useLazyGetOfferByIdQuery,
} from "@/entities/Offer";
import styles from "./HostOffersPage.module.scss";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";

type SeletecBtnType = "delete" | "every_open";

const HostOffersPage = () => {
    const { data: myHost } = useGetMyHostQuery();
    const myHostId = myHost?.id;
    const [deleteOffer, { isLoading: isDeleteLoading }] = useDeleteOfferMutation();
    const [updateOffer] = useUpdateOfferMutation();
    const [triggerHost, { isLoading, data: hostData }] = useLazyGetHostOffersByIdQuery();
    const [triggerOffer, { data: offerData }] = useLazyGetOfferByIdQuery();

    const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<Offer[]>([]);
    const [offersWithClosedStatus, setoffersWithClosedStatus] = useState<Offer[]>([]);

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
    const [selectedBtnOffer, setSelectedBtnOffer] = useState<SeletecBtnType | null>(null);

    const fetchOffers = useCallback(async () => {
        if (myHostId) {
            const result = await triggerHost(myHostId).unwrap();
            setOffersWithOpenStatus(filterOffersByStatus(result, "open"));
            setoffersWithClosedStatus(filterOffersByStatus(result, "empty"));
        }
    }, [myHostId, triggerHost]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    useEffect(() => {
        if (hostData) {
            setOffersWithOpenStatus(filterOffersByStatus(hostData, "open"));
            setoffersWithClosedStatus(filterOffersByStatus(hostData, "empty"));
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
        if (selectedOffer && (selectedBtnOffer === "delete")) {
            await deleteOffer(selectedOffer.toString());
            setSelectedOffer(null);
        }
        if (selectedOffer && (selectedBtnOffer === "every_open")) {
            await triggerOffer(selectedOffer.toString()).unwrap();
            if (offerData?.status === "open") {
                await updateOffer({ body: { status: "every_open" }, id: selectedOffer });
            } else {
                await updateOffer({ body: { status: "open" }, id: selectedOffer });
            }
            setSelectedOffer(null);
        }
    };

    if (isLoading || isDeleteLoading) {
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
            {(selectedOffer && selectedBtnOffer) && (
                <ConfirmActionModal
                    description="Вы уверены что хотите изменить вакансию?"
                    onConfirm={() => handleConfirmClick()}
                    onClose={() => handleModalClose()}
                />
            )}
        </div>
    );
};

export default HostOffersPage;
