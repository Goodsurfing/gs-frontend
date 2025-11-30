import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useCreateSkillMutation } from "@/entities/Admin";
import { AdminSkillFields, AdminSkillForm } from "@/features/Admin";
import { getAdminSkillsAchievementsPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

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
        const { name, imagePath } = data;
        try {
            if (imagePath instanceof File) {
                await createCategory({
                    name,
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
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление навыка</h1>
            <AdminSkillForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminSkillCreatePage;
