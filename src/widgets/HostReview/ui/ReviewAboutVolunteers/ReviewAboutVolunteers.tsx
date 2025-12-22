import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReviewFields } from "@/features/Notes";
import { ReviewFullCard, ReviewMiniCard } from "@/features/Review";

import { SimpleFormApplication } from "@/entities/Application";
import {
    ApplicationReviewResponse, HostModalReview, MyReviewHost,
    useGetMyNotDoneHostReviewQuery,
    useLazyGetMyHostReviewsQuery,
} from "@/entities/Review";

import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { API_BASE_URL } from "@/shared/constants/api";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import { useLazyGetMyHostApplicationsQuery } from "@/entities/Chat";
import styles from "./ReviewAboutVolunteers.module.scss";

interface ReviewAboutVolunteersProps {
    locale: Locale;
    id: string;
}

const ITEMS_PER_PAGE = 20;

export const ReviewAboutVolunteers: FC<ReviewAboutVolunteersProps> = (props) => {
    const { locale, id } = props;
    const { t } = useTranslation("host");
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
    const [myReviews, setMyReviews] = useState<MyReviewHost[]>([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState<MyReviewHost | null>(
        null,
    );

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [getMyReviews, { isLoading: isMyReviewsLoading }] = useLazyGetMyHostReviewsQuery();
    const {
        data: notDoneReviewsData = [],
        isLoading: isNotDoneReviewsLoading,
    } = useGetMyNotDoneHostReviewQuery();
    // const [createToVolunteerReview] = useCreateToVolunteerReviewMutation();

    const fetchMyReviews = useCallback(async (isInitial: boolean) => {
        try {
            const currentPage = isInitial ? 1 : page;

            const result = await getMyReviews({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            }).unwrap();

            if (result.data.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (isInitial) {
                setMyReviews(result.data);
                setPage(2);
            } else {
                setMyReviews((prev) => [...prev, ...result.data]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch { /* empty */ }
    }, [getMyReviews, page]);

    useEffect(() => {
        fetchMyReviews(true);
    }, [fetchMyReviews]);

    const renderFullCards = (reviews: MyReviewHost[]) => reviews.map(
        (review) => <ReviewFullCard type="volunteer" key={review.id} review={review} />,
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
        <div className={styles.wrapper} id="applications-scroll-wrapper1">
            <h3 className={styles.h3}>{t("hostReviews.Отзывы про волонтёров")}</h3>
            <p className={styles.description}>
                {t("hostReviews.Волонтёры, которых вы недавно принимали")}
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
