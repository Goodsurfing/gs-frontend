import React, { FC, useState } from "react";
import {
    useGetAdminBlogCategoryByIdQuery, useUpdateAdminBlogCategoryMutation,
} from "@/entities/Admin";
import { AdminCategoryFields, AdminCategoryForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminCategoryBlogInfo.module.scss";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminCategoriesBlogPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AdminCategoryBlogInfoProps {
    categoryId: number;
}

export const AdminCategoryBlogInfo: FC<AdminCategoryBlogInfoProps> = (props) => {
    const { categoryId } = props;
    const { data: categoryData, isLoading } = useGetAdminBlogCategoryByIdQuery(categoryId);
    const [updateCategory, { isLoading: isUpdateLoading }] = useUpdateAdminBlogCategoryMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminCategoryFields) => {
        setToast(undefined);
        const {
            name, nameEn, nameEs, color,
        } = data;
        try {
            await updateCategory({
                id: categoryId,
                body: {
                    name,
                    nameEn,
                    nameEs,
                    color,
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
            <Breadcrumbs items={[{ label: "Категории блога", to: getAdminCategoriesBlogPageUrl(locale) },
                { label: "Редактирование категории" },
            ]}
            />
            <AdminCategoryForm
                category={categoryData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
                isImageHidden
            />
        </div>
    );
};
