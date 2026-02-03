import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useCreateSkillMutation } from "@/entities/Admin";
import { AdminSkillFields, AdminSkillForm } from "@/features/Admin";
import { getAdminSkillsAchievementsPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminSkillCreatePage.module.scss";

const AdminSkillCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createCategory, { isLoading }] = useCreateSkillMutation();

    const onSuccess = () => {
        navigate(getAdminSkillsAchievementsPageUrl(locale));
    };

    const onSubmit = async (data: AdminSkillFields) => {
        setToast(undefined);
        const {
            name, nameEn, nameEs, imagePath,
        } = data;
        try {
            if (imagePath instanceof File) {
                await createCategory({
                    name,
                    nameEn,
                    nameEs,
                    image: imagePath,
                }).unwrap();
                onSuccess();
            }
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении наывка",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление навыка</h1>
            <Breadcrumbs items={[{ label: "Навыки и достижения", to: getAdminSkillsAchievementsPageUrl(locale) },
                { label: "Создание навыка" },
            ]}
            />
            <AdminSkillForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminSkillCreatePage;
