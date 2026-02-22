import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { newsApiAdapter, useCreateAdminNewsMutation } from "@/entities/Admin";
import {
    AdminArticleForm, AdminArticleFormFields,
} from "@/features/Admin";
import { getAdminNewsPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminNewsCreatePage.module.scss";

const AdminNewsCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createNews, { isLoading }] = useCreateAdminNewsMutation();

    const onSuccess = () => {
        navigate(getAdminNewsPageUrl(locale));
    };

    const onSubmit = async (data: AdminArticleFormFields) => {
        setToast(undefined);
        const preparedData = newsApiAdapter(data);
        try {
            await createNews(preparedData).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении новости",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление новости</h1>
            <Breadcrumbs items={[{ label: "Все новости", to: getAdminNewsPageUrl(locale) },
                { label: "Создание новости" },
            ]}
            />
            <AdminArticleForm
                category="Offer"
                onErrorUploadImage={() => {}}
                onComplete={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminNewsCreatePage;
