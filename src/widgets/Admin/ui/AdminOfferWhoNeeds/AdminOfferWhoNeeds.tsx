import React, { FC, useEffect, useState } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferWhoNeedsFields, WhoNeedsForm } from "@/features/OfferWhoNeedsForm";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    offerWhoNeedsAdapter, offerWhoNeedsApiAdapter,
    useGetAdminVacancyWhoNeedsQuery, useUpdateAdminVacancyWhoNeedsMutation,
} from "@/entities/Admin";
import { OFFER_WHO_NEEDS_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getAdminVacancyDescriptionPageUrl } from "@/shared/config/routes/AppUrls";

interface AdminOfferWhoNeedsProps {
    offerId: string;
}

export const AdminOfferWhoNeeds: FC<AdminOfferWhoNeedsProps> = (props) => {
    const { offerId } = props;
    const [initialDataForm, setInitialDataForm] = useState<OfferWhoNeedsFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferWhoNeeds,
        { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyWhoNeedsMutation();
    const {
        data: offerWhoNeedsData,
        isLoading: isLoadingGet,
    } = useGetAdminVacancyWhoNeedsQuery(offerId);

    useEffect(() => {
        if (offerWhoNeedsData) {
            const adaptedData = offerWhoNeedsAdapter(offerWhoNeedsData);
            setInitialDataForm(adaptedData);
        }
    }, [offerWhoNeedsData]);

    const onSubmit = async (data: OfferWhoNeedsFields) => {
        setToast(undefined);
        const preparedData = offerWhoNeedsApiAdapter(data);
        try {
            await updateOfferWhoNeeds({
                offerId,
                body: preparedData,
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
                isLoadingGetData={isLoadingGet}
                isLoadingUpdateData={isLoadingUpdate}
                linkNext={getAdminVacancyDescriptionPageUrl(locale, offerId)}
            />
        </>

    );
};
