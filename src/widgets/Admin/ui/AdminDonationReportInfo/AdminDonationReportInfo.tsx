import React, { FC, useState } from "react";
import { useGetAdminDonationReportQuery, useUpdateAdminDonationReportMutation } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminDonationReportFields, AdminDonationReportForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminDonationReportsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminDonationReportInfo.module.scss";

interface AdminDonationReportInfoProps {
    reportId: string;
}

export const AdminDonationReportInfo: FC<AdminDonationReportInfoProps> = (props) => {
    const { reportId } = props;
    const { data: reportData, isLoading } = useGetAdminDonationReportQuery(reportId);
    const [updateReport, { isLoading: isUpdateLoading }] = useUpdateAdminDonationReportMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminDonationReportFields) => {
        setToast(undefined);
        const {
            name, files,
        } = data;
        const filesTemp = files.map((file) => ({
            id: file.id,
            name: file.name,
            fileId: file.file.id,
        }));
        try {
            await updateReport({
                id: reportId,
                body: {
                    name,
                    files: filesTemp,
                },
            }).unwrap();
            setToast({
                text: "Отчёт успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении отчёта",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!reportData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница отчёта</h1>
                <Breadcrumbs items={[{ label: "Публичная отчётность", to: getAdminDonationReportsPageUrl(locale) },
                    { label: "Редактирование отчёта" },
                ]}
                />
                <h2>Данные по данному отчёту отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница отчёта</h1>
            <Breadcrumbs items={[{ label: "Публичная отчётность", to: getAdminDonationReportsPageUrl(locale) },
                { label: "Редактирование отчёта" },
            ]}
            />
            <AdminDonationReportForm
                initialData={reportData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
