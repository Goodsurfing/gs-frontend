import React, { FC, useState } from "react";
import {
    blogApiAdapter,
    blogAdapter, useGetAdminBlogByIdQuery, useUpdateAdminBlogMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminArticleForm, AdminArticleFormFields } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminBlogPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminBlogInfo.module.scss";

interface AdminBlogInfoProps {
    blogId: string;
}

export const AdminBlogInfo: FC<AdminBlogInfoProps> = (props) => {
    const { blogId } = props;
    const { data: blogData, isLoading } = useGetAdminBlogByIdQuery(Number(blogId));
    const [updateBlog, { isLoading: isUpdateLoading }] = useUpdateAdminBlogMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminArticleFormFields) => {
        setToast(undefined);
        const preparedData = blogApiAdapter(data);
        try {
            await updateBlog({
                id: Number(blogId),
                body: preparedData,
            }).unwrap();
            setToast({
                text: "Статья успешно сохранена",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении статьи",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!blogData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница блога</h1>
                <Breadcrumbs items={[{ label: "Блог", to: getAdminBlogPageUrl(locale) },
                    { label: "Редактирование статьи" },
                ]}
                />
                <h2>Данные по данной статье отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница блога</h1>
            <Breadcrumbs items={[{ label: "Блог", to: getAdminBlogPageUrl(locale) },
                { label: "Редактирование статьи" },
            ]}
            />
            <AdminArticleForm
                category="Blog"
                initialData={blogAdapter(blogData)}
                onComplete={onSubmit}
                isLoading={isUpdateLoading}
                onErrorUploadImage={() => {}}
            />
        </div>
    );
};
