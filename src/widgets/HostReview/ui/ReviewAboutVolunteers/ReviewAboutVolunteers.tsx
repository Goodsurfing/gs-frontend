import React, { FC, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Review } from "@/types/review";

import { HostReviewFields } from "@/features/Notes";
import { ReviewFullCard, ReviewMiniCard } from "@/features/Review";

import { Application } from "@/entities/Host";
import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { HostModalReview } from "@/entities/Review";

import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { fakeUserData } from "../../model/data/mockedUsersData";
import styles from "./ReviewAboutVolunteers.module.scss";

export const ReviewAboutVolunteers: FC = () => {
    const defaultValues: DefaultValues<HostReviewFields> = {
        hostReview: {
            stars: undefined,
            text: "",
        },
    };
    const [toast] = useState<ToastAlert>();
    const form = useForm<HostReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control } = form;
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
        null,
    );

    const renderFullCards = (reviews: Review[]) => reviews.map(
        (review) => <ReviewFullCard review={review} />,
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
            <h3 className={styles.h3}>Отзывы про волонтёров</h3>
            <p className={styles.description}>
                Волонтёры, которых вы недавно принимали
            </p>
            <VerticalSlider
                classNameSlide={styles.swiperSlide}
                classNameWrapper={styles.swiperWrapper}
                className={styles.slider}
                data={mockedApplications}
                renderItem={(item: Application) => (
                    <ReviewMiniCard data={item} onReviewClick={onReviewClick} variant="volunteer" key={item.id} />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(fakeUserData)}
            </div>
            <Controller
                name="hostReview"
                control={control}
                render={({ field }) => (
                    <HostModalReview
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
