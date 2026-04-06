import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { adminAmbassadorApiAdapter, AdminAmbassadorsFields, useCreateAdminAmbassadorMutation } from "@/entities/Admin";
import { getAdminAmbassadorsPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { AdminAmbassadorForm } from "@/features/Admin";
import styles from "./AdminAmbassadorCreatePage.module.scss";

const AdminAmbassadorCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createAmbassador, { isLoading }] = useCreateAdminAmbassadorMutation();

    const onSuccess = () => {
        navigate(getAdminAmbassadorsPageUrl(locale));
    };

    const onSubmit = async (data: AdminAmbassadorsFields) => {
        setToast(undefined);
        const preparedData = adminAmbassadorApiAdapter(data);
        try {
            await createAmbassador(preparedData).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при создании амбассадора",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление статьи</h1>
            <Breadcrumbs items={[{ label: "Амбассадоры", to: getAdminAmbassadorsPageUrl(locale) },
                { label: "Создание амбассадора" },
            ]}
            />
            <AdminAmbassadorForm
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminAmbassadorCreatePage;
