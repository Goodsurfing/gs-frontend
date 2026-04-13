import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSystemFields, useCreateSystemAdminMutation } from "@/entities/Admin";
import { AdminSystemAdminForm } from "@/features/Admin";
import { getAdminSystemAdminPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminSystemAdminCreatePage.module.scss";

const AdminSystemAdminCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createAdmin, { isLoading }] = useCreateSystemAdminMutation();

    const onSuccess = () => {
        navigate(getAdminSystemAdminPageUrl(locale));
    };

    const onSubmit = async (data: AdminSystemFields) => {
        setToast(undefined);
        if (data.user) {
            try {
                await createAdmin({ id: data.user.id }).unwrap();
                onSuccess();
            } catch {
                setToast({
                    text: "Произошла ошибка при создании администратора",
                    type: HintType.Error,
                });
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление администратора</h1>
            <Breadcrumbs items={[{ label: "Все администраторы", to: getAdminSystemAdminPageUrl(locale) },
                { label: "Создание администратора" },
            ]}
            />
            <AdminSystemAdminForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminSystemAdminCreatePage;
