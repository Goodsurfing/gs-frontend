import React, { FC, useState } from "react";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminSkillFields, AdminSkillForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useEditFoodMutation, useGetFoodByIdQuery } from "@/entities/Admin";

interface AdminFoodInfoProps {
    foodId: number;
}

export const AdminFoodInfo: FC<AdminFoodInfoProps> = (props) => {
    const { foodId } = props;
    const { data: foodData, isLoading } = useGetFoodByIdQuery(foodId);
    const [updateFood, { isLoading: isUpdateLoading }] = useEditFoodMutation();
    const [toast, setToast] = useState<ToastAlert>();

    const onSubmit = async (data: AdminSkillFields) => {
        setToast(undefined);
        const { name, imagePath } = data;
        if (!imagePath) return;
        try {
            await updateFood({
                foodId,
                body: {
                    name,
                    image: imagePath,
                },
            }).unwrap();
            setToast({
                text: "Питание успешно сохранено",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении питания",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!foodData) {
        return (
            <div>
                <h1>Страница питания</h1>
                <h2>Данные по данному питанию отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница питания</h1>
            <AdminSkillForm
                skill={foodData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
