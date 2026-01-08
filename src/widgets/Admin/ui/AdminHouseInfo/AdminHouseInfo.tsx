import React, { FC, useState } from "react";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminSkillFields, AdminSkillForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useEditHouseMutation, useGetHouseByIdQuery } from "@/entities/Admin";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminHouseInfo.module.scss";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AdminHouseInfoProps {
    houseId: number;
}

export const AdminHouseInfo: FC<AdminHouseInfoProps> = (props) => {
    const { houseId } = props;
    const { data: houseData, isLoading } = useGetHouseByIdQuery(houseId);
    const [updateHouse, { isLoading: isUpdateLoading }] = useEditHouseMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminSkillFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        if (!imagePath) return;
        try {
            await updateHouse({
                houseId,
                body: {
                    name,
                    image: imagePath,
                },
            }).unwrap();
            setToast({
                text: "Жильё успешно сохранено",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении жилья",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!houseData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница жилья</h1>
                <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                    { label: "Редактирование жилья" }]}
                />
                <h2>Данные по данному жилью отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница жилья</h1>
            <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                { label: "Редактирование жилья" }]}
            />
            <AdminSkillForm
                skill={houseData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
