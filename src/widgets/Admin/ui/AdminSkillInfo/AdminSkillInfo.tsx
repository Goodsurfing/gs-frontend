import React, { FC, useState } from "react";
import { useEditSkillMutation, useGetSkillByIdQuery } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminSkillFields, AdminSkillForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface AdminSkillInfoProps {
    skillId: number;
}

export const AdminSkillInfo: FC<AdminSkillInfoProps> = (props) => {
    const { skillId } = props;
    const { data: skillData, isLoading } = useGetSkillByIdQuery(skillId);
    const [updateSkill, { isLoading: isUpdateLoading }] = useEditSkillMutation();
    const [toast, setToast] = useState<ToastAlert>();

    const onSubmit = async (data: AdminSkillFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        if (!imagePath) return;
        try {
            await updateSkill({
                skillId,
                body: {
                    name,
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
            <AdminSkillForm
                skill={skillData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
