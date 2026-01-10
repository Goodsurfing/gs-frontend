import React, { FC, useEffect, useState } from "react";
import { useEditAdminReviewVacancyMutation, useGetAdminReviewVacancyByIdQuery } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminReviewFields, AdminReviewForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminReviewsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminReviewVacancyInfo.module.scss";

interface AdminReviewVacancyInfoProps {
    reviewId: string;
}

export const AdminReviewVacancyInfo: FC<AdminReviewVacancyInfoProps> = (props) => {
    const { reviewId } = props;
    const { data: reviewData, isLoading } = useGetAdminReviewVacancyByIdQuery(reviewId);
    const [updateReview, { isLoading: isUpdateLoading }] = useEditAdminReviewVacancyMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewFields, setReviewFields] = useState<AdminReviewFields | undefined>(undefined);
    const { locale } = useLocale();

    useEffect(() => {
        if (reviewData) {
            const { rating, description } = reviewData;
            setReviewFields({
                rating,
                description,
            });
        } else {
            setReviewFields(undefined);
        }
    }, [reviewData]);

    const onSubmit = async (data: AdminReviewFields) => {
        setToast(undefined);
        const { rating, description } = data;
        if (!rating) return;
        try {
            await updateReview({
                reviewId,
                body: {
                    description,
                    rating,
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
                <h1>Страница отзыва на вакансию</h1>
                <Breadcrumbs items={[{ label: "Отзывы", to: getAdminReviewsPageUrl(locale) },
                    { label: "Редактирование отзыва на вакансию" },
                ]}
                />
                <h2>Данные по данному отзыву отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница отзыва на вакансию</h1>
            <Breadcrumbs items={[{ label: "Отзывы", to: getAdminReviewsPageUrl(locale) },
                { label: "Редактирование отзыва на вакансию" },
            ]}
            />
            <AdminReviewForm
                review={reviewFields}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
