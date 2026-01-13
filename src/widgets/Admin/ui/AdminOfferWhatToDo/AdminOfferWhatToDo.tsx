import {
    memo, useState,
} from "react";

import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferWhatToDoForm, OfferWhatToDoFormFields } from "@/features/OfferWhatToDo";

interface AdminOfferWhatToDoProps {
    offerId: string;
}

export const AdminOfferWhatToDo = memo(
    (props: AdminOfferWhatToDoProps) => {
        const { offerId } = props;

        const [initialDataForm] = useState<OfferWhatToDoFormFields | null>(null);
        const [toast] = useState<ToastAlert>();

        const { locale } = useLocale();

        return (
            <>
                {toast && (
                    <HintPopup text={toast.text} type={toast.type} />
                )}
                <OfferWhatToDoForm
                    offerId={offerId}
                    initialData={initialDataForm}
                    onComplete={() => {}}
                    isLoadingGetData
                    isLoadingUpdateData
                    linkNext={getAdminConditionsVacanciesPageUrl(locale, offerId)}
                />
            </>
        );
    },
);
