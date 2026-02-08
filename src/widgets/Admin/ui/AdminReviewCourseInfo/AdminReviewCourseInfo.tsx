import React, { FC, useEffect, useState } from "react";
import {
    GetAdminReviewCourse,
    ReviewCourseInfoTable,
    useGetAdminReviewCourseByIdQuery, useUpdateAdminReviewCourseMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminReviewFields, AdminReviewForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminReviewsCoursesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminReviewCourseInfo.module.scss";

interface AdminReviewCourseInfoProps {
    reviewId: number;
}

export const AdminReviewCourseInfo: FC<AdminReviewCourseInfoProps> = (props) => {
    const { reviewId } = props;
    const { data: reviewData, isLoading } = useGetAdminReviewCourseByIdQuery(reviewId);
    const [updateReview, { isLoading: isUpdateLoading }] = useUpdateAdminReviewCourseMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewFields, setReviewFields] = useState<AdminReviewFields | undefined>(undefined);
    const [reviewInfoTable,
        setReviewInfoTable] = useState<GetAdminReviewCourse | undefined>(undefined);
    const { locale } = useLocale();

    useEffect(() => {
        if (reviewData) {
            const {
                rating, description,
            } = reviewData;
            setReviewFields({
                rating,
                description,
            });
            setReviewInfoTable(reviewData);
        } else {
            setReviewFields(undefined);
            setReviewInfoTable(undefined);
        }
    }, [reviewData]);

    const onSubmit = async (data: AdminReviewFields) => {
        setToast(undefined);
        const {
            description, rating,
        } = data;

        try {
            await updateReview({
                id: reviewId,
                body: {
                    description,
                    rating: rating ?? 0,
                },
            }).unwrap();
            setToast({
                text: "Отзыв успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении отзыва",
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
                <h1>Страница отзыва</h1>
                <Breadcrumbs items={[{ label: "Отзывы курсов", to: getAdminReviewsCoursesPageUrl(locale) },
                    { label: "Редактирование отзыва" },
                ]}
                />
                <h2>Данные по данному отзыву отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница отзыва</h1>
            <Breadcrumbs items={[{ label: "Отзывы курсов", to: getAdminReviewsCoursesPageUrl(locale) },
                { label: "Редактирование отзыва" },
            ]}
            />
            {reviewInfoTable && <ReviewCourseInfoTable data={reviewInfoTable} />}
            <AdminReviewForm
                review={reviewFields}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
