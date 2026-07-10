import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    adminBannerMarketingAdapter,
    adminBannerMarketingApiAdapter,
    AdminBannerMarketingFileds,
    useGetAdminBannerMarketingQuery,
    useUpdateAdminBannerMarketingMutation,
} from "@/entities/Admin";
import { AdminBannerMarketingForm } from "@/features/Admin";
import { getAdminBannerMarketingPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./AdminBannerMarketingPersonalPage.module.scss";

const AdminBannerMarketingPersonalPage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [toast, setToast] = useState<ToastAlert>();

    const { data: banner, isLoading: isBannerLoading } = useGetAdminBannerMarketingQuery(id ?? "", {
        skip: !id,
    });
    const [updateBanner, { isLoading: isUpdating }] = useUpdateAdminBannerMarketingMutation();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id рекламы</h2>
            </div>
        );
    }

    const onSubmit = async (data: AdminBannerMarketingFileds) => {
        setToast(undefined);
        try {
            await updateBanner({ id, body: adminBannerMarketingApiAdapter(data) }).unwrap();
            navigate(getAdminBannerMarketingPageUrl(locale));
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
            <h1>Редактирование рекламы</h1>
            <Breadcrumbs items={[{ label: "Реклама", to: getAdminBannerMarketingPageUrl(locale) },
                { label: "Редактирование рекламы" },
            ]}
            />
            {isBannerLoading || !banner ? (
                <MiniLoader />
            ) : (
                <AdminBannerMarketingForm
                    initialData={adminBannerMarketingAdapter(banner)}
                    onSubmit={onSubmit}
                    isLoading={isUpdating}
                />
            )}
        </div>
    );
};

export default AdminBannerMarketingPersonalPage;
