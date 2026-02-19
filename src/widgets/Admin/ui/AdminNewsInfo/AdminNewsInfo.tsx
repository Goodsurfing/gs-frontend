import React, { FC, useState } from "react";
import {
    newsAdapter, newsApiAdapter, useGetAdminNewsByIdQuery, useUpdateAdminNewsMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminArticleForm, AdminArticleFormFields } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminNewsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminNewsInfo.module.scss";

interface AdminNewsInfoProps {
    newsId: string;
}

export const AdminNewsInfo: FC<AdminNewsInfoProps> = (props) => {
    const { newsId } = props;
    const { data: newsData, isLoading } = useGetAdminNewsByIdQuery(newsId);
    const [updateNews, { isLoading: isUpdateLoading }] = useUpdateAdminNewsMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminArticleFormFields) => {
        setToast(undefined);
        const preparedData = newsApiAdapter(data);
        try {
            await updateNews({
                id: newsId,
                body: preparedData,
            }).unwrap();
            setToast({
                text: "Новость успешно сохранена",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении новости",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!newsData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница новости</h1>
                <Breadcrumbs items={[{ label: "Все новости", to: getAdminNewsPageUrl(locale) },
                    { label: "Редактирование новости" },
                ]}
                />
                <h2>Данные по данной новости отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница новости</h1>
            <Breadcrumbs items={[{ label: "Все новости", to: getAdminNewsPageUrl(locale) },
                { label: "Редактирование новости" },
            ]}
            />
            <AdminArticleForm
                initialData={newsAdapter(newsData)}
                onComplete={onSubmit}
                isLoading={isUpdateLoading}
                onErrorUploadImage={() => {}}
            />
        </div>
    );
};
