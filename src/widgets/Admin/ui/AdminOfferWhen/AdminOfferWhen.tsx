import {
    memo, useState,
} from "react";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    OfferWhenFields, OfferWhenForm,
} from "@/features/Offer";
import { getAdminVacancyWhoNeedsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AdminOfferWhenProps {
    offerId?: string;
    onComplete?: () => void;
}

export const AdminOfferWhen = memo((props: AdminOfferWhenProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onComplete, offerId } = props;
    const [initialDataForm] = useState<OfferWhenFields | null>(null);
    const [toast] = useState<ToastAlert>();

    const { locale } = useLocale();

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {offerId && (
                <OfferWhenForm
                    offerId={offerId}
                    linkNext={getAdminVacancyWhoNeedsPageUrl(locale, offerId)}
                    initialData={initialDataForm}
                    onComplete={() => {}}
                    isLoadingGetWhenData
                    isLoadingUpdateWhenData
                />
            )}
        </>
    );
});
