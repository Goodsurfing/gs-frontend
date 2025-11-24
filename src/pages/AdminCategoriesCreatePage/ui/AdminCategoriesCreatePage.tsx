import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminCategoryForm } from "@/features/Admin";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminCategoriesVacanciesPageUrl } from "@/shared/config/routes/AppUrls";

const AdminCategoriesCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();

    const onSuccess = () => {
        navigate(getAdminCategoriesVacanciesPageUrl(locale));
    };
    return (
        <div>
            <h1>Добавление категории</h1>
            <AdminCategoryForm onSuccess={onSuccess} />
        </div>
    );
};

export default AdminCategoriesCreatePage;
