import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useCreateAchievementMutation } from "@/entities/Admin";
import { getAdminSkillsAchievementsPageUrl } from "@/shared/config/routes/AppUrls";
import { AdminAchievementForm, AdminAchievementFields } from "@/features/Admin";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminAchievementsCreatePage.module.scss";

const AdminAchievementsCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createAchievement, { isLoading }] = useCreateAchievementMutation();

    const onSuccess = () => {
        navigate(getAdminSkillsAchievementsPageUrl(locale));
    };

    const onSubmit = async (data: AdminAchievementFields) => {
        setToast(undefined);
        const {
            name, nameEn, nameEs, imagePath,
        } = data;
        try {
            if (imagePath instanceof File) {
                await createAchievement({
                    name,
                    nameEn,
                    nameEs,
                    image: imagePath,
                }).unwrap();
                onSuccess();
            }
        } catch {
            setToast({
                text: "Произошла ошибка при создании достижения",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление достижения</h1>
            <Breadcrumbs items={[{ label: "Навыки и достижения", to: getAdminSkillsAchievementsPageUrl(locale) },
                { label: "Создание достижения" },
            ]}
            />
            <AdminAchievementForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminAchievementsCreatePage;
