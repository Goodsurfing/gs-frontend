import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    useCreateAdminOurTeamMutation,
    adminOurTeamApiAdapter,
} from "@/entities/Admin";
import { AdminOurTeamForm } from "@/features/Admin";
import { getAdminOurTeamPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { OurTeamFields } from "@/entities/Admin/model/types/adminOurTeam";
import styles from "./AdminOurTeamCreatePage.module.scss";

const AdminOurTeamCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createMember, { isLoading }] = useCreateAdminOurTeamMutation();

    const onSuccess = () => {
        navigate(getAdminOurTeamPageUrl(locale));
    };

    const onSubmit = async (data: OurTeamFields) => {
        setToast(undefined);
        try {
            await createMember(adminOurTeamApiAdapter(data)).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении участника",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление участника</h1>
            <Breadcrumbs items={[{ label: "Наша команда", to: getAdminOurTeamPageUrl(locale) },
                { label: "Создание участника" },
            ]}
            />
            <AdminOurTeamForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminOurTeamCreatePage;
