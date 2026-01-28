import {
    memo, useEffect, useState,
} from "react";

import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminVacancyFinishingTouchesPageUrl } from "@/shared/config/routes/AppUrls";
import { OfferConditionsForm, OfferConditionsFormFields } from "@/features/OfferConditions";
import {
    offerConditionsAdapter, offerConditionsApiAdapter,
    useGetAdminVacancyConditionsQuery, useUpdateAdminVacancyConditionsMutation,
} from "@/entities/Admin";
import { OFFER_CONDITIONS_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";

interface AdminOfferConditionsProps {
    offerId: string;
    className?: string;
}

export const AdminOfferConditions = memo((props: AdminOfferConditionsProps) => {
    const { offerId, className } = props;

    const [initialDataForm, setInitialDataForm] = useState<OfferConditionsFormFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferConditions,
        { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyConditionsMutation();
    const {
        data: offerConditionsData,
        isLoading: isLoadingGet,
    } = useGetAdminVacancyConditionsQuery(offerId);

    useEffect(() => {
        if (offerConditionsData) {
            const adaptedData = offerConditionsAdapter(offerConditionsData);
            setInitialDataForm(adaptedData);
        }
    }, [offerConditionsData]);

    const onSubmit = async (data: OfferConditionsFormFields) => {
        setToast(undefined);
        const preparedData = offerConditionsApiAdapter(data);
        try {
            await updateOfferConditions({ offerId, body: preparedData }).unwrap();
            setToast({ text: "Данные успешно сохранены", type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_CONDITIONS_FORM}${offerId}`);
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <OfferConditionsForm
                initialData={initialDataForm}
                onComplete={onSubmit}
                isLoadingGetData={isLoadingGet}
                isLoadingUpdateData={isLoadingUpdate}
                linkNext={getAdminVacancyFinishingTouchesPageUrl(locale, offerId)}
                className={className}
            />
        </>
    );
});
