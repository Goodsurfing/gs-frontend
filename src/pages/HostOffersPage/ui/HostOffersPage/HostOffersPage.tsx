import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";

import {
    useDeleteOfferMutation,
    useLazyGetHostAllOffersByIdQuery,
    useLazyGetOfferByIdQuery,
    useUpdateOfferStatusMutation,
} from "@/entities/Offer";

import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { useGetMyHostQuery } from "@/entities/Host";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import { OfferPagination } from "@/widgets/OffersMap";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./HostOffersPage.module.scss";

type SeletecBtnType = "delete" | "every_open" | "close";

const ITEMS_PER_PAGE = 10;

const HostOffersPage = () => {
    const { t, ready } = useTranslation("host");
    const { data: myHost } = useGetMyHostQuery();
    const myHostId = myHost?.id;
    const [updateOfferStatus] = useUpdateOfferStatusMutation();
    const [deleteOffer] = useDeleteOfferMutation();

    const [triggerActiveDisabledHostOffers,
        {
            isLoading: isLoadingActiveDisabledHostOffers,
            data: activeDisabledHostOffersData,
        }] = useLazyGetHostAllOffersByIdQuery();
    const [triggerDraftHostOffers,
        {
            isLoading: isLoadingDraftHostOffers,
            data: draftHostOffersData,
        }] = useLazyGetHostAllOffersByIdQuery();
    const [triggerOffer, { isLoading: isOfferLoading }] = useLazyGetOfferByIdQuery();

    // const [offersWithOpenStatus, setOffersWithOpenStatus] = useState<HostOffer[]>(
    //     [],
    // );
    // const [offersWithClosedStatus, setOffersWithClosedStatus] = useState<
    // HostOffer[]
    // >([]);

    const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
    const [selectedBtnOffer, setSelectedBtnOffer] = useState<SeletecBtnType | null>(null);
    const [deleteOfferError, setDeleteOfferError] = useState<boolean>(false);

    const [currentOpenPage, setCurrentOpenPage] = useState(1);
    const [currentDraftPage, setCurrentDraftPage] = useState(1);

    const isModalOpen = selectedOffer !== null && selectedBtnOffer !== null;

    const totalOpenPages = Math.ceil((activeDisabledHostOffersData?.pagination.total ?? 0)
        / ITEMS_PER_PAGE);
    const totalDraftPages = Math.ceil((draftHostOffersData?.pagination.total ?? 0)
    / ITEMS_PER_PAGE);

    const fetchActiveDisabledHostOffers = useCallback(async (page: number) => {
        if (!myHostId) return;

        try {
            await triggerActiveDisabledHostOffers({
                limit: ITEMS_PER_PAGE,
                organizationId: myHostId,
                page,
                statuses: ["active", "disabled"],
            }).unwrap();
        } catch { /* empty */ }
    }, [myHostId, triggerActiveDisabledHostOffers]);

    const fetchDraftHostOffers = useCallback(async (page: number) => {
        if (!myHostId) return;

        try {
            await triggerDraftHostOffers({
                limit: ITEMS_PER_PAGE,
                organizationId: myHostId,
                page,
                statuses: ["draft"],
            }).unwrap();
        } catch { /* empty */ }
    }, [myHostId, triggerDraftHostOffers]);

    useEffect(() => {
        fetchActiveDisabledHostOffers(currentOpenPage);
    }, [fetchActiveDisabledHostOffers, currentOpenPage]);

    useEffect(() => {
        fetchDraftHostOffers(currentDraftPage);
    }, [fetchDraftHostOffers, currentDraftPage]);

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
            fetchActiveDisabledHostOffers(currentOpenPage);
            fetchDraftHostOffers(currentDraftPage);
        }
    };

    if ((isLoadingActiveDisabledHostOffers || isLoadingDraftHostOffers) || !ready) {
        return <MiniLoader />;
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
                offers={activeDisabledHostOffersData?.data ?? []}
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
            {draftHostOffersData?.pagination.total !== 0 && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>{t("hostOffers.Черновики")}</h2>
                    <div className={styles.cards}>
                        <HostOffersList
                            offers={draftHostOffersData?.data ?? []}
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
