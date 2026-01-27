import React, { FC, useEffect, useState } from "react";
import {
    OfferWhenFields, OfferWhenForm, offerWhenFormAdapter, offerWhenFormApiAdapter,
} from "@/features/Offer";
import { useGetOfferByIdQuery, useUpdateOfferMutation } from "@/entities/Offer";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getErrorText } from "@/shared/lib/getErrorText";
import { OFFER_WHEN_FORM } from "@/shared/constants/localstorage";
import { getOffersWhoNeedsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferWhenProps {
    offerId: string;
}

export const OfferWhen: FC<OfferWhenProps> = ({ offerId }) => {
    const [initialDataForm, setInitialDataForm] = useState<OfferWhenFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const { data: getOfferData, isLoading: isLoadingGetWhenData } = useGetOfferByIdQuery(offerId);

    useEffect(() => {
        if (getOfferData?.when) {
            const adaptedData = offerWhenFormAdapter(getOfferData.when);
            setInitialDataForm(adaptedData);
        }
    }, [getOfferData]);

    const onSubmit = async (data: OfferWhenFields) => {
        setToast(undefined);
        const preparedData = offerWhenFormApiAdapter(data);
        try {
            await updateOffer({ id: Number(offerId), body: { when: preparedData } }).unwrap();
            setToast({ text: "Данные успешно сохранены", type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_WHEN_FORM}${offerId}`);
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <OfferWhenForm
                offerId={offerId}
                linkNext={getOffersWhoNeedsPageUrl(locale, offerId)}
                initialData={initialDataForm}
                onComplete={onSubmit}
                isLoadingGetWhenData={isLoadingGetWhenData}
                isLoadingUpdateWhenData={isLoading}
            />
        </>
    );
};
