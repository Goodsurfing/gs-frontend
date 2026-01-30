import {
    memo, useEffect, useState,
} from "react";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    OfferWhenFields, OfferWhenForm,
} from "@/features/Offer";
import { getAdminVacancyWhoNeedsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    offerWhenFormAdapter, offerWhenFormApiAdapter,
    useGetAdminVacancyWhenQuery, useUpdateAdminVacancyWhenMutation,
} from "@/entities/Admin";
import { getErrorText } from "@/shared/lib/getErrorText";
import { OFFER_WHEN_FORM } from "@/shared/constants/localstorage";

interface AdminOfferWhenProps {
    offerId: string;
}

export const AdminOfferWhen = memo((props: AdminOfferWhenProps) => {
    const { offerId } = props;
    const [initialDataForm, setInitialDataForm] = useState<OfferWhenFields | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferWhen, { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyWhenMutation();
    const {
        data: offerWhenData,
        isLoading: isLoadingGetWhen,
    } = useGetAdminVacancyWhenQuery(offerId);

    useEffect(() => {
        if (offerWhenData) {
            const adaptedData = offerWhenFormAdapter(offerWhenData);
            setInitialDataForm(adaptedData);
        }
    }, [offerWhenData]);

    const onSubmit = async (data: OfferWhenFields) => {
        setToast(undefined);
        const preparedData = offerWhenFormApiAdapter(data);
        try {
            await updateOfferWhen({ offerId, body: preparedData }).unwrap();
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
                linkNext={getAdminVacancyWhoNeedsPageUrl(locale, offerId)}
                initialData={initialDataForm}
                onComplete={onSubmit}
                isLoadingGetWhenData={isLoadingGetWhen}
                isLoadingUpdateWhenData={isLoadingUpdate}
            />
        </>
    );
});
