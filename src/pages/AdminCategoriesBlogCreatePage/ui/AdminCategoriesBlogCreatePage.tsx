import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminCategoryFields, AdminCategoryForm } from "@/features/Admin";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminCategoriesBlogPageUrl } from "@/shared/config/routes/AppUrls";
import { useCreateAdminBlogCategoryMutation } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminCategoriesBlogCreatePage.module.scss";

const AdminCategoriesBlogCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createCategory, { isLoading }] = useCreateAdminBlogCategoryMutation();

    const onSuccess = () => {
        navigate(getAdminCategoriesBlogPageUrl(locale));
    };

    const onSubmit = async (data: AdminCategoryFields) => {
        setToast(undefined);
        const {
            name, nameEn, nameEs, color,
        } = data;
        try {
            await createCategory({
                name,
                nameEn,
                nameEs,
                color,
            }).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении категории",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление категории блога</h1>
            <Breadcrumbs items={[{ label: "Категории блога", to: getAdminCategoriesBlogPageUrl(locale) },
                { label: "Создание категории" },
            ]}
            />
            <AdminCategoryForm onSubmit={onSubmit} isLoading={isLoading} isImageHidden />
        </div>
    );
};

export default AdminCategoriesBlogCreatePage;
