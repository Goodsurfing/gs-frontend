import React, { FC, useState } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useGetOfferByIdQuery, useUpdateOfferDescriptionMutation } from "@/entities/Offer";

interface OfferDescriptionProps {
    offerId: string;
    className?: string;
}

export const OfferDescription: FC<OfferDescriptionProps> = (props) => {
    const { offerId, className } = props;

    const [initialDataForm, setInitialDataForm] = useState<OfferDescriptionProps | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferDescription, { isLoading }] = useUpdateOfferDescriptionMutation();
    const {
        data: getOfferData,
        isLoading: isLoadingGetDescription,
    } = useGetOfferByIdQuery(offerId);

    return (
        <div>OfferDescription</div>
    );
};
