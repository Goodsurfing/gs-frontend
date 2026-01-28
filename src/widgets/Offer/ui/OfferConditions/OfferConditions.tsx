import React, { FC, useEffect, useState } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetOfferByIdQuery, useUpdateOfferConditionsMutation } from "@/entities/Offer";
import {
    offerConditionsAdapter, offerConditionsApiAdapter,
    OfferConditionsForm, OfferConditionsFormFields,
} from "@/features/OfferConditions";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { OFFER_CONDITIONS_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getOffersFinishingTouchesPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferConditionsProps {
    offerId: string;
    className?: string;
}

export const OfferConditions: FC<OfferConditionsProps> = (props) => {
    const { offerId, className } = props;

    const [initialDataForm, setInitialDataForm] = useState<OfferConditionsFormFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferConditions, { isLoading }] = useUpdateOfferConditionsMutation();
    const { data: getOfferData, isLoading: isLoadingGetData } = useGetOfferByIdQuery(offerId);

    useEffect(() => {
        if (getOfferData?.condition) {
            const adaptedData = offerConditionsAdapter(getOfferData.condition);
            setInitialDataForm(adaptedData);
        }
    }, [getOfferData]);

    const onSubmit = async (data: OfferConditionsFormFields) => {
        setToast(undefined);
        const preparedData = offerConditionsApiAdapter(data);
        try {
            await updateOfferConditions({ offerId: Number(offerId), body: preparedData }).unwrap();
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
                isLoadingGetData={isLoadingGetData}
                isLoadingUpdateData={isLoading}
                linkNext={getOffersFinishingTouchesPageUrl(locale, offerId)}
                className={className}
            />
        </>
    );
};
