import React, { FC, useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { ReviewFields } from "@/features/Notes";
import { ReviewFullCard, ReviewMiniCard } from "@/features/Review";

import { FullFormApplication } from "@/entities/Application";
import { ApplicationReviewResponse, HostModalReview } from "@/entities/Review";

import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";
import styles from "./ReviewAboutVolunteers.module.scss";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { useCreateToVolunteerReviewMutation, useGetToVolunteerReviewsQuery } from "@/entities/Review/api/reviewApi";
import { API_BASE_URL } from "@/shared/constants/api";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import { useGetMyHostApplicationsQuery } from "@/entities/Chat";

interface ReviewAboutVolunteersProps {
    locale: Locale;
    id: string;
}

export const ReviewAboutVolunteers: FC<ReviewAboutVolunteersProps> = (props) => {
    const { locale, id } = props;
    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };
    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("host");
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;
    const [selectedApplication, setSelectedApplication] = useState<FullFormApplication | null>(
        null,
    );
    const [applications, setApplications] = useState<FullFormApplication[]>([]);

    const { data: hostApplicationsData } = useGetMyHostApplicationsQuery();
    const { data: myReviewsData } = useGetToVolunteerReviewsQuery({ author: id });
    const [createToVolunteerReview] = useCreateToVolunteerReviewMutation();

    useEffect(() => {
        if (hostApplicationsData) {
            const filteredApplications = hostApplicationsData.filter(
                (hostApplication) => (hostApplication.status === "accepted" && !hostApplication.hasFeedbackFromOrganization),
            ).slice(0, 10);
            setApplications([...filteredApplications]);
        } else {
            setApplications([]);
        }
    }, [hostApplicationsData]);

    const renderFullCards = (reviews?: ApplicationReviewResponse[]) => {
        if (!reviews) return null;
        return reviews.map(
            (review) => <ReviewFullCard type="volunteer" key={review.id} review={review} />,
        );
    };

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
            await createToVolunteerReview({
                applicationForm: `${API_BASE_URL}application_forms/${selectedApplication.id.toString()}`,
                stars,
                text,
            })
                .unwrap()
                .then(() => {
                    setToast({
                        text: t("hostReviews.Ваш отзыв был отправлен"),
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                })
                .finally(() => { reset(); });
        }
    });

    const disableRenderVerticalSlider = applications.length < 4;
    const renderApplications = applications.map((item) => (
        <ReviewMiniCard
            data={item}
            onReviewClick={onReviewClick}
            variant="volunteer"
            key={item.id}
            locale={locale}
        />
    ));

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>{t("hostReviews.Отзывы про волонтёров")}</h3>
            <p className={styles.description}>
                {t("hostReviews.Волонтёры, которых вы недавно принимали")}
            </p>
            {!disableRenderVerticalSlider ? (
                <VerticalSlider
                    classNameSlide={styles.swiperSlide}
                    classNameWrapper={styles.swiperWrapper}
                    className={styles.slider}
                    data={applications}
                    renderItem={(item: FullFormApplication) => (
                        <ReviewMiniCard
                            data={item}
                            onReviewClick={onReviewClick}
                            variant="volunteer"
                            key={item.id}
                            locale={locale}
                        />
                    )}
                />
            ) : (
                <div className={styles.applicationContainer}>
                    {renderApplications}
                </div>
            )}
            <div className={styles.fullCardContainer}>
                {renderFullCards(myReviewsData)}
            </div>
            <Controller
                name="review"
                control={control}
                render={({ field }) => (
                    <HostModalReview
                        value={field.value}
                        onChange={field.onChange}
                        application={selectedApplication}
                        isOpen={!!selectedApplication}
                        onClose={resetSelectedReview}
                        sendReview={() => onSendReview()}
                        titleText=""
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
