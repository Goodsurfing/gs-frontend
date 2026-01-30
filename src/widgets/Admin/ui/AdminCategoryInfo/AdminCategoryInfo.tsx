import React, { FC, useState } from "react";
import { useEditCategoryVacancyMutation, useGetCategoryVacancyByIdQuery } from "@/entities/Admin";
import { AdminCategoryFields, AdminCategoryForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminCategoryInfo.module.scss";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminCategoriesVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AdminCategoryInfoProps {
    categoryId: number;
}

export const AdminCategoryInfo: FC<AdminCategoryInfoProps> = (props) => {
    const { categoryId } = props;
    const { data: categoryData, isLoading } = useGetCategoryVacancyByIdQuery(categoryId);
    const [updateCategory, { isLoading: isUpdateLoading }] = useEditCategoryVacancyMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminCategoryFields) => {
        setToast(undefined);
        const {
            name, nameEn, nameEs, color, imagePath,
        } = data;
        if (!imagePath) return;
        try {
            await updateCategory({
                id: categoryId,
                data: {
                    name,
                    nameEn,
                    nameEs,
                    color,
                    image: imagePath,
                },
            }).unwrap();
            setToast({
                text: "Категория успешно сохранена",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении категории",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!categoryData) {
        return (
            <div>
                <h1>Страница категории</h1>
                <h2>Данные по данной категории отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница категории</h1>
            <Breadcrumbs items={[{ label: "Категории вакансий", to: getAdminCategoriesVacanciesPageUrl(locale) },
                { label: "Редактирование категории" },
            ]}
            />
            <AdminCategoryForm
                category={categoryData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
