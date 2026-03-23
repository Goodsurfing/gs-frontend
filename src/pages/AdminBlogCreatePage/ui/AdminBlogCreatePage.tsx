import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { blogApiAdapter, useCreateAdminBlogMutation } from "@/entities/Admin";
import {
    AdminArticleForm, AdminArticleFormFields,
} from "@/features/Admin";
import { getAdminBlogPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminBlogCreatePage.module.scss";

const AdminBlogCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createBlog, { isLoading }] = useCreateAdminBlogMutation();

    const onSuccess = () => {
        navigate(getAdminBlogPageUrl(locale));
    };

    const onSubmit = async (data: AdminArticleFormFields) => {
        setToast(undefined);
        const preparedData = blogApiAdapter(data);
        try {
            await createBlog(preparedData).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении статьи",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление статьи</h1>
            <Breadcrumbs items={[{ label: "Все новости", to: getAdminBlogPageUrl(locale) },
                { label: "Создание статьи" },
            ]}
            />
            <AdminArticleForm
                category="Blog"
                onComplete={onSubmit}
                isLoading={isLoading}
                onErrorUploadImage={() => {}}
            />
        </div>
    );
};

export default AdminBlogCreatePage;
