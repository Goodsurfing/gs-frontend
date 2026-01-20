import {
    memo, useState,
} from "react";

import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminVacancyFinishingTouchesPageUrl } from "@/shared/config/routes/AppUrls";
import { OfferConditionsForm, OfferConditionsFormFields } from "@/features/OfferConditions";

interface AdminOfferConditionsProps {
    offerId: string;
    className?: string;
}

export const AdminOfferConditions = memo((props: AdminOfferConditionsProps) => {
    const { offerId, className } = props;

    const [initialDataForm] = useState<OfferConditionsFormFields | null>(null);
    const [toast] = useState<ToastAlert>();

    const { locale } = useLocale();

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <OfferConditionsForm
                initialData={initialDataForm}
                onComplete={() => {}}
                isLoadingGetData
                isLoadingUpdateData
                linkNext={getAdminVacancyFinishingTouchesPageUrl(locale, offerId)}
                className={className}
            />
        </>
    );
});
