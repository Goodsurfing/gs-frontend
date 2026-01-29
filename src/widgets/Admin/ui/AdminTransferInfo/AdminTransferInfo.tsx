import React, { FC, useState } from "react";
import { useEditTransferMutation, useGetTransfertByIdQuery } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminTransferFields, AdminTransferForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminTransferInfoю.module.scss";

interface AdminTransferInfoProps {
    transferId: number;
}

export const AdminTransferInfo: FC<AdminTransferInfoProps> = (props) => {
    const { transferId } = props;
    const { data: transferData, isLoading } = useGetTransfertByIdQuery(transferId);
    const [updateTransfer, { isLoading: isUpdateLoading }] = useEditTransferMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminTransferFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        if (!imagePath) return;
        try {
            await updateTransfer({
                transferId,
                body: {
                    name,
                    image: imagePath,
                },
            }).unwrap();
            setToast({
                text: "Оплачиваемый проезд успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении оплачиваемого проезда",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!transferData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница оплачиваемого проезда</h1>
                <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                    { label: "Редактирование оплачиваемого проезда" }]}
                />
                <h2>Данные по данному оплачиваемого проезда отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница оплачиваемого проезда</h1>
            <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                { label: "Редактирование оплачиваемого проезда" }]}
            />
            <AdminTransferForm
                transfer={transferData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
