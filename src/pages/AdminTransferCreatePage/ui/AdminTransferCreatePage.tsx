import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useCreateTransferMutation } from "@/entities/Admin";
import { getAdminConditionsVacanciesPageUrl } from "@/shared/config/routes/AppUrls";
import { AdminTransferFields, AdminTransferForm } from "@/features/Admin";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";

const AdminTransferCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createTransfer, { isLoading }] = useCreateTransferMutation();

    const onSuccess = () => {
        navigate(getAdminConditionsVacanciesPageUrl(locale));
    };

    const onSubmit = async (data: AdminTransferFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        try {
            if (imagePath instanceof File) {
                await createTransfer({
                    name,
                    image: imagePath,
                }).unwrap();
                onSuccess();
            }
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении оплачиваемого проезда",
                type: HintType.Error,
            });
        }
    };

    return (
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление оплачиваемого проезда</h1>
            <Breadcrumbs items={[{ label: "Условия для вакансий", to: getAdminConditionsVacanciesPageUrl(locale) },
                { label: "Создание оплачиваемого проезда" }]}
            />
            <AdminTransferForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminTransferCreatePage;
