import React, { FC, useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import InfiniteScroll from "react-infinite-scroll-component";
import { ReviewFields } from "@/features/Notes";
import { ReviewCardOffer, ReviewMiniCard } from "@/features/Review/";

import { ApplicationReviewResponse, VolunteerModalReview, useLazyGetMyVolunteerReviewsQuery } from "@/entities/Review";

import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { SimpleFormApplication } from "@/entities/Application";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getErrorText } from "@/shared/lib/getErrorText";
import { ErrorType } from "@/types/api/error";
import { API_BASE_URL } from "@/shared/constants/api";
import { useLazyGetMyVolunteerApplicationsQuery } from "@/entities/Chat";
import styles from "./ReviewAboutOffers.module.scss";

interface ReviewAboutOffersProps {
    locale: Locale;
    id: string;
}

const ITEMS_PER_PAGE = 20;

export const ReviewAboutOffers: FC<ReviewAboutOffersProps> = (props) => {
    const { locale, id } = props;
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
    const [applications, setApplications] = useState<SimpleFormApplication[]>([]);
    const [myReviews, setMyReviews] = useState<ApplicationReviewResponse[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<SimpleFormApplication | null>(
        null,
    );

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [getVolunteerApplications,
        { data: volunteerApplicationsData, isLoading }] = useLazyGetMyVolunteerApplicationsQuery();
    const [getMyReviews] = useLazyGetMyVolunteerReviewsQuery();
    const [createToOrganizationReview] = useCreateToOrganizationsReviewMutation();

    useEffect(() => {
        getVolunteerApplications({ limit: ITEMS_PER_PAGE, page });
    }, [getVolunteerApplications, page]);

    useEffect(() => {
        if (volunteerApplicationsData) {
            const filteredApplications = volunteerApplicationsData.data.filter(
                (volunteerApplication) => (volunteerApplication.status === "accepted" && !volunteerApplication.hasFeedbackFromVolunteer),
            ).slice(0, 10);
            const adapter: SimpleFormApplication[] = filteredApplications.map((application) => {
                const {
                    id: applicationId, volunteer, chatId, vacancy, startDate, endDate, status,
                    hasFeedbackFromOrganization, hasFeedbackFromVolunteer,
                } = application;
                return {
                    id: applicationId,
                    volunteer: volunteer.id,
                    vacancy,
                    chatId,
                    status,
                    startDate,
                    endDate,
                    hasFeedbackFromOrganization,
                    hasFeedbackFromVolunteer,
                };
            });
            setApplications([...adapter]);
        } else {
            setApplications([]);
        }
    }, [volunteerApplicationsData]);

    const fetchMyReviews = async (isInitial: boolean) => {
        try {
            const currentPage = isInitial ? 1 : page;

            const result = await getMyReviews({
                author: id,
                page: currentPage,
                itemsPerPage: ITEMS_PER_PAGE,
            }).unwrap();

            if (result.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (isInitial) {
                setMyReviews(result);
                setPage(2);
            } else {
                setMyReviews((prev) => [...prev, ...result]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch { /* empty */ }
    };

    useEffect(() => {
        fetchMyReviews(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderFullCards = (reviews?: ApplicationReviewResponse[]) => reviews?.map(
        (review) => <ReviewCardOffer locale={locale} key={review.id} reviewOffer={review} />,
    );

    const onReviewClick = (application: SimpleFormApplication) => {
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

    const disableRenderVerticalSlider = applications.length < 4;
    const renderApplications = applications.map((item) => (
        <ReviewMiniCard
            data={item}
            onReviewClick={onReviewClick}
            variant="offer"
            key={item.id}
            locale={locale}
        />
    ));

    return (
        <div className={styles.wrapper} id="applications-scroll-wrapper1">
            <h3 className={styles.h3}>
                {t("volunteer-review.Отзывы о проектах")}
            </h3>
            <p className={styles.description}>
                {t("volunteer-review.Проекты, которые вы недавно посещали")}
            </p>
            {!disableRenderVerticalSlider ? (
                <VerticalSlider
                    classNameSlide={styles.swiperSlide}
                    classNameWrapper={styles.swiperWrapper}
                    className={styles.slider}
                    data={applications.slice(0, 15)}
                    renderItem={(item: SimpleFormApplication) => (
                        <ReviewMiniCard
                            data={item}
                            onReviewClick={onReviewClick}
                            variant="offer"
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
                <InfiniteScroll
                    dataLength={myReviews.length}
                    next={() => fetchMyReviews(false)}
                    hasMore={hasMore}
                    scrollThreshold="70%"
                    loader={null}
                    scrollableTarget="applications-scroll-wrapper1"
                >
                    {renderFullCards(myReviews)}
                </InfiniteScroll>
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
