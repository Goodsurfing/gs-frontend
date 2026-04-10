import React, { FC, useEffect, useState } from "react";
import {
    adminOurTeamApiAdapter, OurTeamFields,
    useGetAdminOurTeamByIdQuery, useUpdateAdminOurTeamMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminOurTeamForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminOurTeamPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminOurTeamInfo.module.scss";

interface AdminOurTeamInfoProps {
    memberId: string;
}

export const AdminOurTeamInfo: FC<AdminOurTeamInfoProps> = (props) => {
    const { memberId } = props;
    const { data: memberData, isLoading } = useGetAdminOurTeamByIdQuery(memberId);
    const [updateMember, { isLoading: isUpdateLoading }] = useUpdateAdminOurTeamMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const [initialData, setInitialData] = useState<OurTeamFields | undefined>();
    const { locale } = useLocale();

    useEffect(() => {
        if (memberData) {
            setInitialData(memberData);
        }
    }, [memberData]);

    const onSubmit = async (data: OurTeamFields) => {
        setToast(undefined);
        try {
            await updateMember({
                id: memberId,
                body: adminOurTeamApiAdapter(data),
            }).unwrap();
            setToast({
                text: "Участник успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении участника",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!memberData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница участника</h1>
                <Breadcrumbs items={[{ label: "Наша команда", to: getAdminOurTeamPageUrl(locale) },
                    { label: "Редактирование участника" },
                ]}
                />
                <h2>Данные по данному участнику отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница участника</h1>
            <Breadcrumbs items={[{ label: "Наша команда", to: getAdminOurTeamPageUrl(locale) },
                { label: "Редактирование участника" },
            ]}
            />
            <AdminOurTeamForm
                initialData={initialData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
