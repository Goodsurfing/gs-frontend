import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    offerFinishingTouchesAdapter, OfferFinishingTouchesForm,
    OfferFinishingTouchesFormFields, offerFinishingTouchesApiAdapter,
} from "@/features/OfferFinishingTouches";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    OfferStatus, useGetOfferByIdQuery, useUpdateOfferMutation, useUpdateOfferStatusMutation,
} from "@/entities/Offer";
import { getErrorText } from "@/shared/lib/getErrorText";
import { OFFER_FINISHING_TOUCHES_FORM } from "@/shared/constants/localstorage";
import { getMyOffersPageUrl } from "@/shared/config/routes/AppUrls";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";

interface OfferFinishingTouchesProps {
    offerId: string;
    className?: string;
}

export const OfferFinishingTouches: FC<OfferFinishingTouchesProps> = (props) => {
    const { offerId, className } = props;

    const [initialDataForm,
        setInitialDataForm] = useState<OfferFinishingTouchesFormFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState<{
        data: OfferFinishingTouchesFormFields;
        status: OfferStatus;
    } | null>(null);

    const { t } = useTranslation("offer");
    const { locale } = useLocale();
    const navigate = useNavigate();

    const [updateOfferFinishingTouches,
        { isLoading: isLoadingUpdateData }] = useUpdateOfferMutation();
    const [updateOfferStatus] = useUpdateOfferStatusMutation();
    const { data: getOfferData, isLoading: isLoadingGetData } = useGetOfferByIdQuery(offerId);

    useEffect(() => {
        if (getOfferData?.finishingTouche) {
            const adaptedData = offerFinishingTouchesAdapter(getOfferData.finishingTouche);
            setInitialDataForm(adaptedData);
        }
    }, [getOfferData]);

    const handleConfirmPublish = async () => {
        if (!pendingSubmission) return;

        const { data, status } = pendingSubmission;
        setIsConfirmModalOpen(false);
        setPendingSubmission(null);

        try {
            await updateOfferFinishingTouches({
                id: Number(offerId),
                body: {
                    finishingTouches: offerFinishingTouchesApiAdapter(data),
                },
            }).unwrap();

            if (status === "active") {
                await updateOfferStatus({ id: offerId, status }).unwrap();
            }

            setToast({ text: t("Данные успешно изменены"), type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_FINISHING_TOUCHES_FORM}${offerId}`);
            navigate(getMyOffersPageUrl(locale));
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    const handleFormComplete = async (
        data: OfferFinishingTouchesFormFields,
        newStatus: OfferStatus,
    ) => {
        setToast(undefined);

        const currentStatus = getOfferData?.status ?? "draft";

        if (currentStatus === "draft" && newStatus === "active") {
            setPendingSubmission({ data, status: "active" });
            setIsConfirmModalOpen(true);
            return;
        }

        try {
            await updateOfferFinishingTouches({
                id: Number(offerId),
                body: {
                    finishingTouches: offerFinishingTouchesApiAdapter(data),
                },
            }).unwrap();

            const message = newStatus === "draft"
                ? t("Черновик сохранён")
                : t("Данные успешно изменены");

            setToast({ text: message, type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_FINISHING_TOUCHES_FORM}${offerId}`);
            navigate(getMyOffersPageUrl(locale));
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <OfferFinishingTouchesForm
                initialData={initialDataForm}
                offerStatusData={getOfferData?.status ?? "draft"}
                onComplete={handleFormComplete}
                isLoadingGetData={isLoadingGetData}
                isLoadingUpdateData={isLoadingUpdateData}
                className={className}
            />
            <ConfirmActionModal
                isModalOpen={isConfirmModalOpen}
                description="Вы уверены, что хотите опубликовать это предложение? После публикации его увидят другие пользователи."
                confirmTextButton="Опубликовать"
                cancelTextButton="Отмена"
                onConfirm={handleConfirmPublish}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setPendingSubmission(null);
                }}
                isLoading={isLoadingUpdateData}
                buttonsDisabled={isLoadingUpdateData}
            />
        </>
    );
};
