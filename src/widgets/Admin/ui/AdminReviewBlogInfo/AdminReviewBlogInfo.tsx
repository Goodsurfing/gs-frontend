import React, { FC, useEffect, useState } from "react";
import {
    GetAdminReviewBlog,
    ReviewBlogInfoTable,
    useGetAdminReviewBlogByIdQuery,
    useUpdateAdminReviewBlogMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    AdminLessonReviewFields, AdminLessonReviewForm,
} from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminReviewsCommunityPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminReviewBlogInfo.module.scss";

interface AdminReviewBlogInfoProps {
    reviewId: string;
}

export const AdminReviewBlogInfo: FC<AdminReviewBlogInfoProps> = (props) => {
    const { reviewId } = props;
    const { data: reviewData, isLoading } = useGetAdminReviewBlogByIdQuery(reviewId);
    const [updateReview, { isLoading: isUpdateLoading }] = useUpdateAdminReviewBlogMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewFields,
        setReviewFields] = useState<AdminLessonReviewFields | undefined>(undefined);
    const [reviewInfoTable,
        setReviewInfoTable] = useState<GetAdminReviewBlog | undefined>(undefined);
    const { locale } = useLocale();

    useEffect(() => {
        if (reviewData) {
            const {
                description, isActive,
            } = reviewData;
            setReviewFields({
                description,
                isActive,
                rating: null,
            });
            setReviewInfoTable(reviewData);
        } else {
            setReviewFields(undefined);
            setReviewInfoTable(undefined);
        }
    }, [reviewData]);

    const onSubmit = async (data: AdminLessonReviewFields) => {
        setToast(undefined);
        const {
            description, isActive,
        } = data;

        try {
            await updateReview({
                id: reviewId,
                body: {
                    description,
                    isActive,
                },
            }).unwrap();
            setToast({
                text: "Комментарий успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении комментария",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!reviewData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница комментария</h1>
                <Breadcrumbs items={[{ label: "Комментарии", to: getAdminReviewsCommunityPageUrl(locale) },
                    { label: "Редактирование комментария" },
                ]}
                />
                <h2>Данные по данному комментарию отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница комментария</h1>
            <Breadcrumbs items={[{ label: "Комментарии", to: getAdminReviewsCommunityPageUrl(locale) },
                { label: "Редактирование комментария" },
            ]}
            />
            {reviewInfoTable && <ReviewBlogInfoTable data={reviewInfoTable} />}
            <AdminLessonReviewForm
                review={reviewFields}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
                isRatingHidden
            />
        </div>
    );
};
