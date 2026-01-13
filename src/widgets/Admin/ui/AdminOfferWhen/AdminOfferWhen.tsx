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

interface AdminOfferWhenProps {
    offerId?: string;
    onComplete?: () => void;
}

export const AdminOfferWhen = memo((props: AdminOfferWhenProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onComplete, offerId } = props;
    const [initialDataForm] = useState<OfferWhenFields | null>(null);

    const [toast] = useState<ToastAlert>();

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <OfferWhenForm
                initialData={initialDataForm}
                onComplete={() => {}}
                isLoadingGetWhenData
                isLoadingUpdateWhenData
            />
        </>
    );
});
