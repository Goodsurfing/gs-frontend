import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminVideoFileds, useCreateAdminVideoMutation, videoAdminApiAdapter } from "@/entities/Admin";
import {
    AdminVideoForm,
} from "@/features/Admin";
import { getAdminVideoPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminVideoCreatePage.module.scss";

const AdminVideoCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createVideo, { isLoading }] = useCreateAdminVideoMutation();

    const onSuccess = () => {
        navigate(getAdminVideoPageUrl(locale));
    };

    const onSubmit = async (data: AdminVideoFileds) => {
        setToast(undefined);
        const preparedData = videoAdminApiAdapter(data);
        try {
            await createVideo(preparedData).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении видео",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление видео</h1>
            <Breadcrumbs items={[{ label: "Все видео", to: getAdminVideoPageUrl(locale) },
                { label: "Создание видео" },
            ]}
            />
            <AdminVideoForm
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminVideoCreatePage;
