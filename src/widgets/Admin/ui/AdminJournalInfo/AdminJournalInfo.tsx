import React, { FC, useState } from "react";
import {
    useGetAdminJournalByIdQuery, useUpdateAdminJournalMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminJournalForm, AdminJournalFormFields } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminJournalsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { journalAdapter, journalApiAdapter } from "@/entities/Journal";
import styles from "./AdminJournalInfo.module.scss";

interface AdminJournalInfoProps {
    journalId: string;
}

export const AdminJournalInfo: FC<AdminJournalInfoProps> = (props) => {
    const { journalId } = props;
    const { data: journalData, isLoading } = useGetAdminJournalByIdQuery(journalId);
    const [updateJournal, { isLoading: isUpdateLoading }] = useUpdateAdminJournalMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminJournalFormFields) => {
        setToast(undefined);
        const preparedData = journalApiAdapter(data);
        try {
            await updateJournal({
                id: journalId,
                body: preparedData,
            }).unwrap();
            setToast({
                text: "Журнал успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении журнала",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!journalData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница журнала</h1>
                <Breadcrumbs items={[{ label: "Все журналы", to: getAdminJournalsPageUrl(locale) },
                    { label: "Редактирование журнала" },
                ]}
                />
                <h2>Данные по данному журналу отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница журнала</h1>
            <Breadcrumbs items={[{ label: "Все журналы", to: getAdminJournalsPageUrl(locale) },
                { label: "Редактирование журнала" },
            ]}
            />
            <AdminJournalForm
                initialData={journalAdapter(journalData)}
                onComplete={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
