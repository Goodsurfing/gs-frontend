import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetAdminVacancyDescriptionQuery, useUpdateAdminVacancyDescriptionMutation } from "@/entities/Admin";
import { OfferDescriptionField } from "@/features/Offer";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

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
    const { t } = useTranslation("volunteer");

    const [updateOfferDescription,
        { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyDescriptionMutation();
    const {
        data: offerDescriptionData,
        isLoading: isLoadingGet,
    } = useGetAdminVacancyDescriptionQuery(offerId);

    useEffect(() => {
        if (offerDescriptionData) {
            const adaptedData = inviteDescriptionAdapter(offerDescriptionData);
            setInitialDataForm(adaptedData);
        }
    }, [offerDescriptionData]);

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
        <div>AdminOfferDescription</div>
    );
};
