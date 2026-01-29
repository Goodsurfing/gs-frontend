import React, { FC, useState } from "react";
import { useEditSkillMutation, useGetSkillByIdQuery } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminSkillFields, AdminSkillForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminSkillsAchievementsPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./AdminSkillInfo.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AdminSkillInfoProps {
    skillId: number;
}

export const AdminSkillInfo: FC<AdminSkillInfoProps> = (props) => {
    const { skillId } = props;
    const { data: skillData, isLoading } = useGetSkillByIdQuery(skillId);
    const [updateSkill, { isLoading: isUpdateLoading }] = useEditSkillMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminSkillFields) => {
        setToast(undefined);
        const {
            name, nameEn, nameEs, imagePath,
        } = data;
        if (!imagePath) return;
        try {
            await updateSkill({
                skillId,
                body: {
                    name,
                    nameEn,
                    nameEs,
                    image: imagePath,
                },
            }).unwrap();
            setToast({
                text: "Навык успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении навыка",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!skillData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница навыка</h1>
                <Breadcrumbs items={[{ label: "Навыки и достижения пользователей", to: getAdminSkillsAchievementsPageUrl(locale) },
                    { label: "Редактирование навыка" },
                ]}
                />
                <h2>Данные по данному навыку отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница навыка</h1>
            <Breadcrumbs items={[{ label: "Навыки и достижения пользователей", to: getAdminSkillsAchievementsPageUrl(locale) },
                { label: "Редактирование навыка" },
            ]}
            />
            <AdminSkillForm
                skill={skillData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
