import {
    memo, useEffect, useState,
} from "react";

import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferWhatToDoForm, OfferWhatToDoFormFields } from "@/features/OfferWhatToDo";
import {
    offerWhatToDoAdapter, offerWhatToDoApiAdapter,
    useGetAdminVacancyWhatToDoQuery, useUpdateAdminVacancyWhatToDoMutation,
} from "@/entities/Admin";
import { OFFER_WHAT_TO_DO_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";

interface AdminOfferWhatToDoProps {
    offerId: string;
}

export const AdminOfferWhatToDo = memo(
    (props: AdminOfferWhatToDoProps) => {
        const { offerId } = props;

        const [initialDataForm,
            setInitialDataForm] = useState<OfferWhatToDoFormFields | null>(null);
        const [toast, setToast] = useState<ToastAlert>();

        const { locale } = useLocale();

        const [updateOfferWhatToDo,
            { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyWhatToDoMutation();
        const {
            data: offerWhatTodoData,
            isLoading: isLoadingGet,
        } = useGetAdminVacancyWhatToDoQuery(offerId);

        useEffect(() => {
            if (offerWhatTodoData) {
                const adaptedData = offerWhatToDoAdapter(offerWhatTodoData);
                setInitialDataForm(adaptedData);
            }
        }, [offerWhatTodoData]);

        const onSubmit = async (data: OfferWhatToDoFormFields) => {
            setToast(undefined);
            const preparedData = offerWhatToDoApiAdapter(data);
            try {
                await updateOfferWhatToDo({ offerId, body: preparedData }).unwrap();
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
                    offerId={offerId}
                    initialData={initialDataForm}
                    onComplete={onSubmit}
                    isLoadingGetData={isLoadingGet}
                    isLoadingUpdateData={isLoadingUpdate}
                    linkNext={getAdminConditionsVacanciesPageUrl(locale, offerId)}
                />
            </>
        );
    },
);
