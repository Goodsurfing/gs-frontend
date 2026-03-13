import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminDonationReportFields, useCreateAdminDonationReportMutation } from "@/entities/Admin";
import { AdminDonationReportForm } from "@/features/Admin";
import { getAdminDonationReportsPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminDonationReportCreatePage.module.scss";

const AdminDonationReportCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createDonationReport, { isLoading }] = useCreateAdminDonationReportMutation();

    const onSuccess = () => {
        navigate(getAdminDonationReportsPageUrl(locale));
    };

    const onSubmit = async (data: AdminDonationReportFields) => {
        setToast(undefined);
        const {
            name, files,
        } = data;
        const fileTemp = files.map((file) => ({
            name: file.name,
            fileId: file.file.id,
        }));
        try {
            await createDonationReport({
                name,
                files: fileTemp,
            }).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при создании отчёта",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление отчёта</h1>
            <Breadcrumbs items={[{ label: "Публичная отчётность", to: getAdminDonationReportsPageUrl(locale) },
                { label: "Создание отчёта" },
            ]}
            />
            <AdminDonationReportForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminDonationReportCreatePage;
