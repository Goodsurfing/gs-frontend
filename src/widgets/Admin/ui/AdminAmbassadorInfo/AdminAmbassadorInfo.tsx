import React, { FC, useEffect, useState } from "react";
import {
    useGetAdminAmbassadorByIdQuery, useUpdateAdminAmbassadorMutation,
    adminAmbassadorApiAdapter, AdminAmbassadorsFields, adminAmbassadorAdapter,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminAmbassadorForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminAmbassadorsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminAmbassadorInfo.module.scss";

interface AdminAmbassadorInfoProps {
    id: string;
}

export const AdminAmbassadorInfo: FC<AdminAmbassadorInfoProps> = (props) => {
    const { id } = props;
    const { data: ambassadorData, isLoading } = useGetAdminAmbassadorByIdQuery(id);
    const [updateAmbassador, { isLoading: isUpdateLoading }] = useUpdateAdminAmbassadorMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const [ambassador, setAmbassador] = useState<AdminAmbassadorsFields>();
    const { locale } = useLocale();

    useEffect(() => {
        if (ambassadorData) {
            setAmbassador(adminAmbassadorAdapter(ambassadorData));
        } else {
            setAmbassador(undefined);
        }
    }, [ambassadorData]);

    const onSubmit = async (data: AdminAmbassadorsFields) => {
        setToast(undefined);
        const preparedData = adminAmbassadorApiAdapter(data);
        try {
            await updateAmbassador({
                id,
                body: preparedData,
            }).unwrap();
            setToast({
                text: "Амбассадор успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении амбассадора",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!ambassadorData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница амбассадора</h1>
                <Breadcrumbs items={[{ label: "Амбассадоры", to: getAdminAmbassadorsPageUrl(locale) },
                    { label: "Редактирование амбассадора" },
                ]}
                />
                <h2>Данные по данному амбассадору отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница амбассадора</h1>
            <Breadcrumbs items={[{ label: "Амбассадоры", to: getAdminAmbassadorsPageUrl(locale) },
                { label: "Редактирование амбассадора" },
            ]}
            />
            <AdminAmbassadorForm
                initialData={ambassador}
                onSubmit={onSubmit}
                isLoading={isLoading || isUpdateLoading}
            />
        </div>
    );
};
