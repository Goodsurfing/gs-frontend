import React, { FC, useEffect, useState } from "react";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    offerWhatToDoAdapter, offerWhatToDoApiAdapter, OfferWhatToDoForm, OfferWhatToDoFormFields,
} from "@/features/OfferWhatToDo";
import { useGetOfferByIdQuery, useUpdateOfferWhatToDoMutation } from "@/entities/Offer";
import { getErrorText } from "@/shared/lib/getErrorText";
import { OFFER_WHAT_TO_DO_FORM } from "@/shared/constants/localstorage";
import { getOffersConditionsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferWhatToDoProps {
    offerId: string;
}

export const OfferWhatToDo: FC<OfferWhatToDoProps> = (props) => {
    const { offerId } = props;

    const [initialDataForm, setInitialDataForm] = useState<OfferWhatToDoFormFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferWhatToDo, { isLoading: isLoadingUpdate }] = useUpdateOfferWhatToDoMutation();
    const { data: getOfferData, isLoading: isLoadingGet } = useGetOfferByIdQuery(offerId);

    useEffect(() => {
        if (getOfferData?.whatToDo) {
            const adaptedData = offerWhatToDoAdapter(getOfferData.whatToDo);
            setInitialDataForm(adaptedData);
        }
    }, [getOfferData]);

    const onSubmit = async (data: OfferWhatToDoFormFields) => {
        setToast(undefined);
        const preparedData = offerWhatToDoApiAdapter(data);
        try {
            await updateOfferWhatToDo({ offerId: Number(offerId), body: preparedData }).unwrap();
            setToast({ text: "Данные успешно сохранены", type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_WHAT_TO_DO_FORM}${offerId}`);
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    return (
        <>
            {toast && (
                <HintPopup text={toast.text} type={toast.type} />
            )}
            <OfferWhatToDoForm
                locale={locale}
                offerId={offerId}
                initialData={initialDataForm}
                onComplete={onSubmit}
                isLoadingGetData={isLoadingGet}
                isLoadingUpdateData={isLoadingUpdate}
                linkNext={getOffersConditionsPageUrl(locale, offerId)}
            />
        </>
    );
};
