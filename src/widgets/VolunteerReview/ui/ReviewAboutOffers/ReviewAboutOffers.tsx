import React, { FC, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReviewCardInfo } from "@/types/review";

import { VolunteerReviewFields } from "@/features/Notes";
import { ReviewCardOffer, ReviewMiniCard } from "@/features/Review/";

import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { VolunteerModalReview } from "@/entities/Review";

import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { mockedReviewOfferData } from "../../model/data/mockedReviewData";
import styles from "./ReviewAboutOffers.module.scss";
import { FullFormApplication } from "@/entities/Application";

export const ReviewAboutOffers: FC = () => {
    const { t } = useTranslation("volunteer");
    const defaultValues: DefaultValues<VolunteerReviewFields> = {
        volunteerReview: {
            stars: undefined,
            text: "",
        },
    };
    const [toast] = useState<ToastAlert>();
    const form = useForm<VolunteerReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control } = form;
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
        null,
    );

    const renderFullCards = (reviews: ReviewCardInfo[]) => reviews.map(
        (review) => <ReviewCardOffer reviewOffer={review} />,
    );

    const onReviewClick = (id: number) => {
        setSelectedReviewId(id);
    };

    const resetSelectedReview = () => {
        setSelectedReviewId(null);
    };

    const onSendReview = handleSubmit(() => {});

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
                data={mockedApplications}
                renderItem={(item: FullFormApplication) => (
                    <ReviewMiniCard
                        data={item}
                        onReviewClick={onReviewClick}
                        variant="offer"
                        key={item.id}
                    />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(mockedReviewOfferData)}
            </div>
            <Controller
                name="volunteerReview"
                control={control}
                render={({ field }) => (
                    <VolunteerModalReview
                        value={field.value}
                        onChange={field.onChange}
                        application={mockedApplications[0]}
                        isOpen={!!selectedReviewId}
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
                    />
                )}
            />
        </div>
    );
};
