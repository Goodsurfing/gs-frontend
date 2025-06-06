import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";

import {
    Offer,
    useDeleteOfferMutation,
    useLazyGetHostAllOffersByIdQuery,
    useLazyGetOfferByIdQuery,
    useUpdateOfferStatusMutation,
} from "@/entities/Offer";

import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import { HostOffersList } from "../HostOffersList/HostOffersList";
import styles from "./HostOffersPage.module.scss";
import { useGetMyHostQuery } from "@/entities/Host";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";

type SeletecBtnType = "delete" | "every_open" | "close";

const HostOffersPage = () => {
    const { t } = useTranslation("host");
    const { data: myHost } = useGetMyHostQuery();
    const myHostId = myHost?.id;
    const [updateOfferStatus] = useUpdateOfferStatusMutation();
    const [deleteOffer] = useDeleteOfferMutation();

    const [triggerHost, { isLoading, data: hostData }] = useLazyGetHostAllOffersByIdQuery();
    const [triggerOffer, { isLoading: isOfferLoading }] = useLazyGetOfferByIdQuery();

    const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<Offer[]>(
        [],
    );
    const [offersWithClosedStatus, setoffersWithClosedStatus] = useState<
    Offer[]
    >([]);

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
    const [selectedBtnOffer, setSelectedBtnOffer] = useState<SeletecBtnType | null>(null);
    const [deleteOfferError, setDeleteOfferError] = useState<boolean>(false);
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
        setSelectedBtnOffer("close");
    };

    const handleDeleteClick = (offerId: number) => {
        setSelectedOffer(offerId);
        setSelectedBtnOffer("delete");
    };

    // const handleEveryOpenClick = (offerId: number) => {
    //     setSelectedOffer(offerId);
    //     setSelectedBtnOffer("every_open");
    // };
    // Hide this function for now

    const handleModalClose = () => {
        setSelectedOffer(null);
        setSelectedBtnOffer(null);
    };

    const handleConfirmClick = async () => {
        if (selectedOffer && selectedBtnOffer === "close") {
            await triggerOffer(selectedOffer.toString())
                .unwrap()
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
        if (selectedOffer && selectedBtnOffer === "delete") {
            await deleteOffer(selectedOffer.toString())
                .unwrap()
                .catch(() => {
                    setDeleteOfferError(true);
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
            {(deleteOfferError) && (
                <HintPopup
                    text={t("hostOffers.Ошибка изменения вакансии")}
                    type={HintType.Error}
                />
            )}
            <h2 className={styles.abilities}>{t("hostOffers.Мои вакансии")}</h2>
            <HostOffersList
                offers={offersWithOpenStatus}
                onCloseClick={(offerId) => handleCloseClick(offerId)}
                onDeleteClick={(offerId) => handleDeleteClick(offerId)}
                // onEveryOpenClick={(offerId) => handleEveryOpenClick(offerId)}
            />
            {!!offersWithClosedStatus.length && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>{t("hostOffers.Черновики")}</h2>
                    <div className={styles.cards}>
                        <HostOffersList
                            offers={offersWithClosedStatus}
                            onCloseClick={(offerId) => handleCloseClick(offerId)}
                            onDeleteClick={(offerId) => handleDeleteClick(offerId)}
                            // onEveryOpenClick={(offerId) => handleEveryOpenClick(offerId)}
                        />
                    </div>
                </div>
            )}
            <AddOffer />
            <ConfirmActionModal
                isModalOpen={isModalOpen}
                description={t("hostOffers.Вы уверены что хотите изменить вакансию?")}
                onConfirm={() => handleConfirmClick()}
                onClose={() => handleModalClose()}
                isLoading={isOfferLoading}
                confirmTextButton={t("hostOffers.Ок")}
                cancelTextButton={t("hostOffers.Отмена")}
            />
        </div>
    );
};

export default HostOffersPage;
