import React, { FC, useState } from "react";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminFoodFields, AdminFoodForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useEditFoodMutation, useGetFoodByIdQuery } from "@/entities/Admin";
import styles from "./AdminFoodInfo.module.scss";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AdminFoodInfoProps {
    foodId: number;
}

export const AdminFoodInfo: FC<AdminFoodInfoProps> = (props) => {
    const { foodId } = props;
    const { data: foodData, isLoading } = useGetFoodByIdQuery(foodId);
    const [updateFood, { isLoading: isUpdateLoading }] = useEditFoodMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminFoodFields) => {
        setToast(undefined);
        const {
            name, nameEn, nameEs, imagePath,
        } = data;
        if (!imagePath) return;
        try {
            await updateFood({
                foodId,
                body: {
                    name,
                    nameEn,
                    nameEs,
                    image: imagePath,
                },
            }).unwrap();
            setToast({
                text: "Питание успешно сохранено",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении питания",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!foodData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница питания</h1>
                <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                    { label: "Редактирование питания" }]}
                />
                <h2>Данные по данному питанию отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница питания</h1>
            <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                { label: "Редактирование питания" }]}
            />
            <AdminFoodForm
                food={foodData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
