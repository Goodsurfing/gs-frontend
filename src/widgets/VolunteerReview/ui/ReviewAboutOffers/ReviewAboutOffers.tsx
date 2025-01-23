import React, { FC, useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ReviewFields } from "@/features/Notes";
import { ReviewMiniCard } from "@/features/Review/";

import { VolunteerModalReview } from "@/entities/Review";

import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { FullFormApplication } from "@/entities/Application";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import styles from "./ReviewAboutOffers.module.scss";
import { useGetMyVolunteerApplicationsQuery } from "@/entities/Application/api/applicationApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getErrorText } from "@/shared/lib/getErrorText";
import { ErrorType } from "@/types/api/error";
import { API_BASE_URL } from "@/shared/constants/api";
import { useCreateToOrganizationsReviewMutation } from "@/entities/Review/api/reviewApi";

interface ReviewAboutOffersProps {
    locale: Locale;
}

export const ReviewAboutOffers: FC<ReviewAboutOffersProps> = (props) => {
    const { locale } = props;
    const { t } = useTranslation("volunteer");
    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };
    const [toast, setToast] = useState<ToastAlert>();
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;
    const [applications, setApplications] = useState<FullFormApplication[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<FullFormApplication | null>(
        null,
    );

    const { data: volunteerApplicationsData, isLoading } = useGetMyVolunteerApplicationsQuery();
    const [createToOrganizationReview] = useCreateToOrganizationsReviewMutation();

    useEffect(() => {
        if (volunteerApplicationsData) {
            const filteredApplications = volunteerApplicationsData.filter(
                (volunteerApplication) => volunteerApplication.status === "accepted",
            );
            setApplications([...filteredApplications]);
        } else {
            setApplications([]);
        }
    }, [volunteerApplicationsData]);

    // const renderFullCards = (reviews: ReviewCardInfo[]) => reviews.map(
    //     (review) => <ReviewCardOffer reviewOffer={review} />,
    // );

    const onReviewClick = (application: FullFormApplication) => {
        setSelectedApplication(application);
    };

    const resetSelectedReview = () => {
        setSelectedApplication(null);
        setToast(undefined);
        reset();
    };

    const onSendReview = handleSubmit(async (data) => {
        const {
            review: { stars, text },
        } = data;
        if (selectedApplication && stars) {
            setToast(undefined);
            const applicationForm = `${API_BASE_URL}application_forms/${selectedApplication.id.toString()}`;
            await createToOrganizationReview({ applicationForm, stars, text })
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Ваш отзыв был отправлен",
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                })
                .finally(() => {
                    reset();
                });
        }
    });

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>
                {t("volunteer-review.Отзывы о проектах")}
            </h3>
            <p className={styles.description}>
                {t("volunteer-review.Проекты, которые вы недавно посещали")}
            </p>
            <VerticalSlider
                classNameSlide={styles.swiperSlide}
                classNameWrapper={styles.swiperWrapper}
                className={styles.slider}
                data={applications}
                renderItem={(item: FullFormApplication) => (
                    <ReviewMiniCard
                        data={item}
                        onReviewClick={onReviewClick}
                        variant="offer"
                        key={item.id}
                        locale={locale}
                    />
                )}
            />
            <div className={styles.fullCardContainer}>
                {/* {renderFullCards(mockedReviewOfferData)} */}
            </div>
            <Controller
                name="review"
                control={control}
                render={({ field }) => (
                    <VolunteerModalReview
                        value={field.value}
                        onChange={field.onChange}
                        application={selectedApplication}
                        isOpen={!!selectedApplication}
                        onClose={resetSelectedReview}
                        sendReview={() => onSendReview()}
                        successText={
                            toast?.type === HintType.Success
                                ? toast?.text
                                : undefined
                        }
                        errorText={
                            toast?.type === HintType.Error
                                ? toast?.text
                                : undefined
                        }
                        locale={locale}
                    />
                )}
            />
        </div>
    );
};
