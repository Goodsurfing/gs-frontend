import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminCategoryFields, AdminCategoryForm } from "@/features/Admin";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminCategoriesVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { useCreateCategoryVacancyMutation } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

const AdminCategoriesCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createCategory, { isLoading }] = useCreateCategoryVacancyMutation();

    const onSuccess = () => {
        navigate(getAdminCategoriesVacanciesPageUrl(locale));
    };

    const onSubmit = async (data: AdminCategoryFields) => {
        setToast(undefined);
        const { name, color, imagePath } = data;
        try {
            if (imagePath instanceof File) {
                await createCategory({
                    name,
                    color,
                    image: imagePath,
                }).unwrap();
                onSuccess();
            }
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении категории",
                type: HintType.Error,
            });
        }
    };

    return (
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление категории</h1>
            <AdminCategoryForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminCategoriesCreatePage;
