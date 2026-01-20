import React, { FC, useEffect, useState } from "react";
import {
    offerWhoNeedsAdapter, offerWhoNeedsApiAdapter, OfferWhoNeedsFields, WhoNeedsForm,
} from "@/features/OfferWhoNeedsForm";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetOfferByIdQuery, useUpdateOfferMutation } from "@/entities/Offer";
import { getErrorText } from "@/shared/lib/getErrorText";
import { OFFER_WHO_NEEDS_FORM } from "@/shared/constants/localstorage";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getOffersDescriptionPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferWhoNeedsProps {
    offerId: string;
}

export const OfferWhoNeeds: FC<OfferWhoNeedsProps> = (props) => {
    const { offerId } = props;

    const [initialDataForm, setInitialDataForm] = useState<OfferWhoNeedsFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferWhoNeeds, { isLoading: isLoadingUpdateData }] = useUpdateOfferMutation();
    const {
        data: getOfferData,
        isLoading: isLoadingGetData,
    } = useGetOfferByIdQuery(offerId);

    useEffect(() => {
        setToast(undefined);
        if (getOfferData?.howNeed) {
            const adaptedData = offerWhoNeedsApiAdapter(getOfferData.howNeed);
            setInitialDataForm(adaptedData);
        }
    }, [getOfferData]);

    const onSubmit = async (data: OfferWhoNeedsFields) => {
        setToast(undefined);
        const preparedData = offerWhoNeedsAdapter(data);
        try {
            await updateOfferWhoNeeds({
                id: Number(offerId),
                body: { howNeeds: preparedData },
            }).unwrap();
            setToast({ text: "Данные успешно сохранены", type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_WHO_NEEDS_FORM}${offerId}`);
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <WhoNeedsForm
                initialData={initialDataForm}
                onComplete={onSubmit}
                isLoadingGetData={isLoadingGetData}
                isLoadingUpdateData={isLoadingUpdateData}
                linkNext={getOffersDescriptionPageUrl(locale, offerId)}
            />
        </>

    );
};
