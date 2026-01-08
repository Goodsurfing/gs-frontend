import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useCreateFoodMutation } from "@/entities/Admin";
import { AdminFoodForm, AdminFoodFields } from "@/features/Admin";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";

const AdminFoodCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createFood, { isLoading }] = useCreateFoodMutation();

    const onSuccess = () => {
        navigate(getAdminConditionsVacanciesPageUrl(locale));
    };

    const onSubmit = async (data: AdminFoodFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        try {
            if (imagePath instanceof File) {
                await createFood({
                    name,
                    image: imagePath,
                }).unwrap();
                onSuccess();
            }
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении питания",
                type: HintType.Error,
            });
        }
    };

    return (
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление питания</h1>
            <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                { label: "Создание питания" }]}
            />
            <AdminFoodForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminFoodCreatePage;
