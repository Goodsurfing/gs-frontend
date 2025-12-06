import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useCreateHouseMutation } from "@/entities/Admin";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminHouseForm, AdminHouseFields } from "@/features/Admin";

const AdminHouseCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createHouse, { isLoading }] = useCreateHouseMutation();

    const onSuccess = () => {
        navigate(getAdminConditionsVacanciesPageUrl(locale));
    };

    const onSubmit = async (data: AdminHouseFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        try {
            if (imagePath instanceof File) {
                await createHouse({
                    name,
                    image: imagePath,
                }).unwrap();
                onSuccess();
            }
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении жилья",
                type: HintType.Error,
            });
        }
    };

    return (
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление жилья</h1>
            <AdminHouseForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminHouseCreatePage;
