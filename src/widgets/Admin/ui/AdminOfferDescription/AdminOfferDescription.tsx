import React, { FC, useEffect, useState } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    offerDescriptionAdapter, offerDescriptionApiAdapter,
    useGetAdminVacancyDescriptionQuery, useUpdateAdminVacancyDescriptionMutation,
    useUpdateAdminVacancyImageGalleryMutation,
} from "@/entities/Admin";
import { InviteDescriptionForm, OfferDescriptionField } from "@/features/Offer";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { OFFER_DESCRIPTION_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import { getAdminVacancyWhatToDoPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface AdminOfferDescriptionProps {
    offerId: string;
    className?: string;
}

export const AdminOfferDescription: FC<AdminOfferDescriptionProps> = (props) => {
    const { offerId, className } = props;

    const [initialDataForm,
        setInitialDataForm] = useState<Partial<OfferDescriptionField> | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();

    const [updateOfferDescription,
        { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyDescriptionMutation();
    const {
        data: offerDescriptionData,
        isLoading: isLoadingGet,
    } = useGetAdminVacancyDescriptionQuery(offerId);

    const [updateOfferImageGallery] = useUpdateAdminVacancyImageGalleryMutation();

    useEffect(() => {
        if (offerDescriptionData) {
            const adaptedData = offerDescriptionAdapter(offerDescriptionData);
            setInitialDataForm(adaptedData);
        }
    }, [offerDescriptionData]);

    const onSubmit = async (data: OfferDescriptionField) => {
        setToast(undefined);
        const preparedData = offerDescriptionApiAdapter(data);
        try {
            await updateOfferDescription({ offerId, body: preparedData }).unwrap();
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
                text: "Галерея успешно обновлена",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка с обновлением галереи",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={className}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <InviteDescriptionForm
                initialData={initialDataForm}
                imageGallery={offerDescriptionData?.galleryImages}
                onComplete={onSubmit}
                onUploadImageGallery={onUploadImageGallery}
                isLoadingGetData={isLoadingGet}
                isLoadingUpdateData={isLoadingUpdate}
                linkNext={getAdminVacancyWhatToDoPageUrl(locale, offerId)}
            />
        </div>
    );
};
