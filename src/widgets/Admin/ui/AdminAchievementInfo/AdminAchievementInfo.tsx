import React, { FC, useState } from "react";
import { useEditAchievementMutation, useGetAchievementByIdQuery } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminAchievementFields, AdminAchievementForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface AdminAchievementInfoProps {
    achievementId: number;
}

export const AdminAchievementInfo: FC<AdminAchievementInfoProps> = (props) => {
    const { achievementId } = props;
    const { data: achievementData, isLoading } = useGetAchievementByIdQuery(achievementId);
    const [updateAchievement, { isLoading: isUpdateLoading }] = useEditAchievementMutation();
    const [toast, setToast] = useState<ToastAlert>();

    const onSubmit = async (data: AdminAchievementFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        if (!imagePath) return;
        try {
            await updateAchievement({
                achievementId,
                body: {
                    name,
                    image: imagePath,
                },
            }).unwrap();
            setToast({
                text: "Достижение успешно сохранено",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении достижения",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!achievementData) {
        return (
            <div>
                <h1>Страница навыка</h1>
                <h2>Данные по данному навыку отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница навыка</h1>
            <AdminAchievementForm
                achievement={achievementData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
