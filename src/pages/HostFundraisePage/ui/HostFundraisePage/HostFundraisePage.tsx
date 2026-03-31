import {
    FC,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    GetDonations,
    useCreateDonationMutation,
    useDeleteDonationByIdMutation,
    useLazyGetDonationsQuery,
    useUpdateDonationStatusMutation,
} from "@/entities/Donation";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    getDonationPersonalPage,
    getFundraiseWelcomePageUrl,
} from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HostFundraiseCard } from "../HostFundraiseCard/HostFundraiseCard";
import styles from "./HostFundraisePage.module.scss";

type ActionType = "delete" | "close";

const HostFundraisePage: FC = () => {
    const { t, ready } = useTranslation("host");
    const { locale } = useLocale();
    const navigate = useNavigate();

    const [fetchActive, {
        data: activeData,
        isLoading: isLoadingActive,
    }] = useLazyGetDonationsQuery();
    const [fetchDrafts, {
        data: draftsData,
        isLoading: isLoadingDrafts,
    }] = useLazyGetDonationsQuery();
    const [deleteFundraise] = useDeleteDonationByIdMutation();
    const [updateStatus] = useUpdateDonationStatusMutation();
    const [createFundraise, { isLoading: isCreating }] = useCreateDonationMutation();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<ActionType | null>(null);

    const isModalOpen = selectedId !== null && actionType !== null;

    const refetchAll = useCallback(() => {
        fetchActive({ isAuth: true, status: "active" });
        fetchDrafts({ isAuth: true, status: "draft" });
    }, [fetchActive, fetchDrafts]);

    useEffect(() => {
        refetchAll();
    }, [refetchAll]);

    const handleEditClick = (id: string, isDraft = false) => {
        if (isDraft) {
            navigate(getFundraiseWelcomePageUrl(locale, id));
            return;
        }

        navigate(getDonationPersonalPage(locale, id));
    };

    const handleCloseClick = (id: string) => {
        setSelectedId(id);
        setActionType("close");
    };

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setActionType("delete");
    };

    const handleModalClose = () => {
        setSelectedId(null);
        setActionType(null);
    };

    const handleConfirm = async () => {
        if (!selectedId) return;
        try {
            if (actionType === "delete") {
                await deleteFundraise(selectedId).unwrap();
            } else if (actionType === "close") {
                await updateStatus({ id: selectedId, body: { status: "close" } }).unwrap();
            }
        } catch { /* empty */ } finally {
            handleModalClose();
            refetchAll();
        }
    };

    const handleAddFundraise = async () => {
        try {
            const result = await createFundraise().unwrap();
            navigate(getFundraiseWelcomePageUrl(locale, result.id));
        } catch { /* empty */ }
    };

    const renderCards = (items: GetDonations[], isDraft = false) => {
        if (!items.length) {
            return <span className={styles.empty}>{t("hostFundraises.Нет сборов")}</span>;
        }
        return items.map((fundraise) => (
            <HostFundraiseCard
                key={fundraise.id}
                fundraise={fundraise}
                onEditClick={() => handleEditClick(fundraise.id, isDraft)}
                onCloseClick={() => handleCloseClick(fundraise.id)}
                onDeleteClick={() => handleDeleteClick(fundraise.id)}
            />
        ));
    };

    if (isLoadingActive || isLoadingDrafts || !ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    const activeItems = activeData?.data ?? [];
    const draftItems = draftsData?.data ?? [];

    return (
        <div className={styles.wrapper}>
            <h2>{t("hostFundraises.Мои сборы")}</h2>
            <div className={styles.list}>
                {renderCards(activeItems)}
            </div>
            {draftItems.length > 0 && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>{t("hostFundraises.Черновики")}</h2>
                    <div className={styles.list}>
                        {renderCards(draftItems, true)}
                    </div>
                </div>
            )}
            <Button
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
                className={styles.addButton}
                onClick={handleAddFundraise}
                disabled={isCreating}
            >
                {t("hostFundraises.Добавить сбор")}
            </Button>
            <ConfirmActionModal
                isModalOpen={isModalOpen}
                description={t("hostFundraises.Вы уверены что хотите изменить сбор?")}
                onConfirm={handleConfirm}
                onClose={handleModalClose}
                confirmTextButton={t("hostFundraises.Ок")}
                cancelTextButton={t("hostFundraises.Отмена")}
            />
        </div>
    );
};

export default HostFundraisePage;
