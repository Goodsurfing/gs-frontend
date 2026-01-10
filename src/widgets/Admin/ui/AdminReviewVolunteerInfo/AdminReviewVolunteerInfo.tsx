import React, { FC, useEffect, useState } from "react";
import {
    ReviewVolunteer, ReviewVolunteerInfoTable, useEditAdminReviewVolunteerMutation,
    useGetAdminReviewVolunteerByIdQuery,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminReviewFields, AdminReviewForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminReviewsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminReviewVolunteerInfo.module.scss";

interface AdminReviewVolunteerInfoProps {
    reviewId: string;
}

export const AdminReviewVolunteerInfo: FC<AdminReviewVolunteerInfoProps> = (props) => {
    const { reviewId } = props;
    const { data: reviewData, isLoading } = useGetAdminReviewVolunteerByIdQuery(reviewId);
    const [updateReview, { isLoading: isUpdateLoading }] = useEditAdminReviewVolunteerMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewFields, setReviewFields] = useState<AdminReviewFields | undefined>(undefined);
    const [reviewInfoTable, setReviewInfoTable] = useState<ReviewVolunteer | undefined>(undefined);
    const { locale } = useLocale();

    useEffect(() => {
        if (reviewData) {
            const {
                rating, description, id, authorFirstName,
                authorLastName, volunteerFirstName, volunteerLastName,
                created,
            } = reviewData;
            setReviewFields({
                rating,
                description,
            });
            setReviewInfoTable({
                id,
                authorFirstName,
                authorLastName,
                volunteerFirstName,
                volunteerLastName,
                created,
            });
        } else {
            setReviewFields(undefined);
            setReviewInfoTable(undefined);
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
            {reviewInfoTable && <ReviewVolunteerInfoTable data={reviewInfoTable} />}
            <AdminReviewForm
                review={reviewFields}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
