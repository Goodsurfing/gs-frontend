import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useCreateAdminJournalMutation } from "@/entities/Admin";
import {
    AdminJournalForm,
    AdminJournalFormFields,
} from "@/features/Admin";
import { getAdminJournalsPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { journalApiAdapter } from "@/entities/Journal";
import styles from "./AdminJournalCreatePage.module.scss";

const AdminJournalCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createJob, { isLoading }] = useCreateAdminJournalMutation();

    const onSuccess = () => {
        navigate(getAdminJournalsPageUrl(locale));
    };

    const onSubmit = async (data: AdminJournalFormFields) => {
        setToast(undefined);
        const preparedData = journalApiAdapter(data);
        try {
            await createJob(preparedData).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при создании журнала",
                type: HintType.Error,
            });
        }
    };

    const onErrorUploadImage = (error: string) => {
        setToast(undefined);
        setTimeout(() => {
            setToast({
                text: error,
                type: HintType.Error,
            });
        }, 0);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление журнала</h1>
            <Breadcrumbs items={[{ label: "Все журналы", to: getAdminJournalsPageUrl(locale) },
                { label: "Создание журнала" },
            ]}
            />
            <AdminJournalForm
                onComplete={onSubmit}
                onErrorUploadImage={onErrorUploadImage}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminJournalCreatePage;
