import React, { FC, useState, useMemo } from "react";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminVideoForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminVideoPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useUpdateVideoMutation } from "@/entities/Video";
import {
    AdminVideoFileds, useGetAdminVideoByIdQuery, videoAdminAdapter, videoAdminApiAdapter,
} from "@/entities/Admin";
import styles from "./AdminVideoInfo.module.scss";

interface AdminVideoInfoProps {
    videoId: string;
}

export const AdminVideoInfo: FC<AdminVideoInfoProps> = (props) => {
    const { videoId } = props;
    const { data: videoData, isLoading } = useGetAdminVideoByIdQuery(videoId);
    const [updateVideo, { isLoading: isUpdateLoading }] = useUpdateVideoMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const initialData = useMemo(() => (videoData
        ? videoAdminAdapter(videoData) : undefined), [videoData]);

    const onSubmit = async (data: AdminVideoFileds) => {
        setToast(undefined);

        try {
            await updateVideo({
                id: videoId,
                body: videoAdminApiAdapter(data),
            }).unwrap();
            setToast({
                text: "Видео успешно сохранено",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!videoData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница видео</h1>
                <Breadcrumbs items={[{ label: "Видео", to: getAdminVideoPageUrl(locale) },
                    { label: "Редактирование видео" },
                ]}
                />
                <h2>Данные по данному видео отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница видео</h1>
            <Breadcrumbs items={[{ label: "Видео", to: getAdminVideoPageUrl(locale) },
                { label: "Редактирование видео" },
            ]}
            />
            <AdminVideoForm
                initialData={initialData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
