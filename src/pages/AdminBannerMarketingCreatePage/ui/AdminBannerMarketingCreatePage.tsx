import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    adminBannerMarketingApiAdapter,
    AdminBannerMarketingFileds,
    useCreateAdminBannerMarketingMutation,
} from "@/entities/Admin";
import { AdminBannerMarketingForm } from "@/features/Admin";
import { getAdminBannerMarketingPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminBannerMarketingCreatePage.module.scss";

const AdminBannerMarketingCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createBanner, { isLoading }] = useCreateAdminBannerMarketingMutation();

    const onSuccess = () => {
        navigate(getAdminBannerMarketingPageUrl(locale));
    };

    const onSubmit = async (data: AdminBannerMarketingFileds) => {
        setToast(undefined);
        try {
            await createBanner(adminBannerMarketingApiAdapter(data)).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении рекламы",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление рекламы</h1>
            <Breadcrumbs items={[{ label: "Реклама", to: getAdminBannerMarketingPageUrl(locale) },
                { label: "Создание рекламы" },
            ]}
            />
            <AdminBannerMarketingForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminBannerMarketingCreatePage;
