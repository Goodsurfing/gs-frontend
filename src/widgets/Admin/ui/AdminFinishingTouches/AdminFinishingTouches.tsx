import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    offerFinishingTouchesAdapter, offerFinishingTouchesApiAdapter,
    useGetAdminVacancyFinishingTouchesQuery, useUpdateAdminVacancyFinishingTouchesMutation,
} from "@/entities/Admin";
import { OfferStatus } from "@/entities/Offer";
import { OfferFinishingTouchesFormFields } from "@/features/OfferFinishingTouches";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { getAdminVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { OFFER_FINISHING_TOUCHES_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";

interface AdminFinishingTouchesProps {
    offerId: string;
    className?: string;
}

export const AdminFinishingTouches: FC<AdminFinishingTouchesProps> = (props) => {
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
        { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyFinishingTouchesMutation();
    const {
        data: offerFinishingTouchesData,
        isLoading: isLoadingGet,
    } = useGetAdminVacancyFinishingTouchesQuery(offerId);

    useEffect(() => {
        if (offerFinishingTouchesData) {
            const adaptedData = offerFinishingTouchesAdapter(offerFinishingTouchesData);
            setInitialDataForm(adaptedData);
        }
    }, [offerFinishingTouchesData]);

    const handleConfirmPublish = async () => {
        if (!pendingSubmission) return;

        const { data, status } = pendingSubmission;
        setIsConfirmModalOpen(false);
        setPendingSubmission(null);

        try {
            await updateOfferFinishingTouches({
                offerId,
                body: offerFinishingTouchesApiAdapter(data),
            }).unwrap();

            // if (status === "active") {
            //     await updateOfferStatus({ id: offerId, status }).unwrap();
            // }

            setToast({ text: t("Данные успешно изменены"), type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_FINISHING_TOUCHES_FORM}${offerId}`);
            navigate(getAdminVacanciesPageUrl(locale));
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    return (
        <div>AdminFinishingTouches</div>
    );
};
