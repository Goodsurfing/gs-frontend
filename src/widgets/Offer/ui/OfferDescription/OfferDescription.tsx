import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    useGetOfferByIdQuery,
    useUpdateOfferDescriptionMutation, useUpdateOfferImageGalleryMutation,
} from "@/entities/Offer";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    inviteDescriptionAdapter, inviteDescriptionApiAdapter,
    InviteDescriptionForm, OfferDescriptionField,
} from "@/features/Offer";
import { OFFER_DESCRIPTION_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import { getOffersWhatToDoPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferDescriptionProps {
    offerId: string;
    className?: string;
}

export const OfferDescription: FC<OfferDescriptionProps> = (props) => {
    const { offerId, className } = props;

    const [initialDataForm,
        setInitialDataForm] = useState<Partial<OfferDescriptionField> | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();
    const { t } = useTranslation("volunteer");

    const [updateOfferDescription, { isLoading }] = useUpdateOfferDescriptionMutation();
    const {
        data: getOfferData,
        isLoading: isLoadingGetDescription,
    } = useGetOfferByIdQuery(offerId);

    const [updateOfferImageGallery] = useUpdateOfferImageGalleryMutation();

    useEffect(() => {
        if (getOfferData?.description) {
            const adaptedData = inviteDescriptionAdapter(getOfferData?.description);
            setInitialDataForm(adaptedData);
        }
    }, [getOfferData]);

    const onSubmit = async (data: OfferDescriptionField) => {
        setToast(undefined);
        const preparedData = inviteDescriptionApiAdapter(data);
        try {
            await updateOfferDescription({ offerId: Number(offerId), body: preparedData }).unwrap();
            setToast({ text: "Данные успешно сохранены", type: HintType.Success });
            sessionStorage.removeItem(`${OFFER_DESCRIPTION_FORM}${offerId}`);
        } catch (error: unknown) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        }
    };

    const onUploadImageGallery = async (imageGallery: string[]) => {
        setToast(undefined);
        try {
            await updateOfferImageGallery({
                offerId: Number(offerId),
                body: { galleryImageIds: imageGallery },
            }).unwrap();

            setToast({
                text: t("volunteer-gallery.Галерея успешно обновлена"),
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: t("volunteer-gallery.Произошла ошибка с обновлением галереи"),
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={className}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <InviteDescriptionForm
                initialData={initialDataForm}
                imageGallery={getOfferData?.galleryImages}
                onComplete={onSubmit}
                onUploadImageGallery={onUploadImageGallery}
                isLoadingGetData={isLoadingGetDescription}
                isLoadingUpdateData={isLoading}
                linkNext={getOffersWhatToDoPageUrl(locale, offerId)}
            />
        </div>
    );
};
