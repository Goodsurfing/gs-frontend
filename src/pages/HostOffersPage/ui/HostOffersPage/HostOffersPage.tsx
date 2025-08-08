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
import { OfferPagination } from "@/widgets/OffersMap";

type SeletecBtnType = "delete" | "every_open" | "close";

const ITEMS_PER_PAGE = 6;

const HostOffersPage = () => {
    const { t, ready } = useTranslation("host");
    const { data: myHost } = useGetMyHostQuery();
    const myHostId = myHost?.id;
    const [updateOfferStatus] = useUpdateOfferStatusMutation();
    const [deleteOffer] = useDeleteOfferMutation();

    const [triggerHost, { isLoading, data: hostData }] = useLazyGetHostAllOffersByIdQuery();
    const [triggerOffer, { isLoading: isOfferLoading }] = useLazyGetOfferByIdQuery();

    const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<Offer[]>(
        [],
    );
    const [offersWithClosedStatus, setOffersWithClosedStatus] = useState<
    Offer[]
    >([]);

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
    const [selectedBtnOffer, setSelectedBtnOffer] = useState<SeletecBtnType | null>(null);
    const [deleteOfferError, setDeleteOfferError] = useState<boolean>(false);

    const [currentOpenPage, setCurrentOpenPage] = useState(1);
    const [currentDraftPage, setCurrentDraftPage] = useState(1);

    const isModalOpen = selectedOffer !== null && selectedBtnOffer !== null;

    const paginatedOpenOffers = offersWithOpenStatus.slice(
        (currentOpenPage - 1) * ITEMS_PER_PAGE,
        currentOpenPage * ITEMS_PER_PAGE,
    );

    const paginatedDraftOffers = offersWithClosedStatus.slice(
        (currentDraftPage - 1) * ITEMS_PER_PAGE,
        currentDraftPage * ITEMS_PER_PAGE,
    );

    const totalOpenPages = Math.ceil(offersWithOpenStatus.length / ITEMS_PER_PAGE);
    const totalDraftPages = Math.ceil(offersWithClosedStatus.length / ITEMS_PER_PAGE);

    const fetchOffers = useCallback(async () => {
        if (!myHostId) return;

        try {
            const result = await triggerHost(myHostId).unwrap();
            setOffersWithOpenStatus(filterOffersByStatus(result, "active"));
            setOffersWithClosedStatus(filterOffersByStatus(result, "draft"));
            setCurrentOpenPage(1);
            setCurrentDraftPage(1);
        } catch { /* empty */ }
    }, [myHostId, triggerHost]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    useEffect(() => {
        if (hostData) {
            setOffersWithOpenStatus(filterOffersByStatus(hostData, "active"));
            setOffersWithClosedStatus(filterOffersByStatus(hostData, "draft"));
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
        try {
            if (selectedOffer && selectedBtnOffer === "close") {
                const result = await triggerOffer(selectedOffer.toString()).unwrap();

                if (result.status === "active") {
                    await updateOfferStatus({
                        status: "disabled",
                        id: selectedOffer.toString(),
                    }).unwrap();
                } else if (result.status === "disabled") {
                    await updateOfferStatus({
                        status: "active",
                        id: selectedOffer.toString(),
                    }).unwrap();
                }
            }

            if (selectedOffer && selectedBtnOffer === "delete") {
                await deleteOffer(selectedOffer.toString()).unwrap();
            }
        } catch (err) {
            if (selectedBtnOffer === "delete") {
                setDeleteOfferError(true);
            }
        } finally {
            handleModalClose();
            fetchOffers();
        }
    };

    if (isLoading || !ready) {
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
                offers={paginatedOpenOffers}
                onCloseClick={(offerId) => handleCloseClick(offerId)}
                onDeleteClick={(offerId) => handleDeleteClick(offerId)}
            />
            {totalOpenPages > 1 && (
                <OfferPagination
                    currentPage={currentOpenPage}
                    onPageChange={setCurrentOpenPage}
                    totalPages={totalOpenPages}
                    className={styles.pagination}
                />
            )}
            {!!offersWithClosedStatus.length && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>{t("hostOffers.Черновики")}</h2>
                    <div className={styles.cards}>
                        <HostOffersList
                            offers={paginatedDraftOffers}
                            onCloseClick={handleCloseClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    </div>

                    {totalDraftPages > 1 && (
                        <OfferPagination
                            currentPage={currentDraftPage}
                            onPageChange={setCurrentDraftPage}
                            totalPages={totalDraftPages}
                            className={styles.pagination}
                        />
                    )}
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
