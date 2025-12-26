import { Pagination } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { useLocale } from "@/app/providers/LocaleProvider";

import { NotesWidget } from "@/widgets/NotesWidget";

import { Application } from "@/entities/Application";
import { VolunteerModalReview, useCreateOfferReviewMutation } from "@/entities/Review";

import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import { ReviewFields } from "../../model/types/notes";
import { useLazyGetMyVolunteerApplicationsQuery } from "@/entities/Chat";
import styles from "./NotesVolunteerForm.module.scss";

const APPLICATION_PER_PAGE = 10;

export const NotesVolunteerForm = () => {
    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };

    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;
    const [selectedApplication,
        setSelectedApplication] = useState<Application | null>(null);

    const [adaptedApplications, setAdaptedApplications] = useState<Application[]>([]);
    const [page, setPage] = useState<number>(1);
    const [getApplicationsData,
        { data: applications, isLoading }] = useLazyGetMyVolunteerApplicationsQuery();
    const [createOfferReview] = useCreateOfferReviewMutation();

    const fetchApplications = useCallback(async (limit: number, pageItem: number) => {
        await getApplicationsData({ limit, page: pageItem });
    }, [getApplicationsData]);

    useEffect(() => {
        fetchApplications(APPLICATION_PER_PAGE, page);
    }, [fetchApplications, getApplicationsData, page]);

    useEffect(() => {
        if (applications) {
            setAdaptedApplications(applications.data);
        }
    }, [applications]);

    const totalPageCount = applications?.pagination
        ? Math.ceil(applications.pagination.total / APPLICATION_PER_PAGE)
        : 0;

    const onReviewClick = (application: Application) => {
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

            await createOfferReview({
                vacancyId: selectedApplication.vacancy.id,
                rating: stars,
                description: text,
            })
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Ваш отзыв был отправлен",
                        type: HintType.Success,
                    });
                    fetchApplications(APPLICATION_PER_PAGE, page);
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
            <NotesWidget
                className={styles.notes}
                notes={adaptedApplications}
                variant="volunteer"
                onReviewClick={onReviewClick}
                isDragDisable
                locale={locale}
            />
            <Pagination
                count={totalPageCount}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                size="large"
            />
            <Controller
                name="review"
                control={control}
                render={({ field }) => (
                    <VolunteerModalReview
                        value={field.value}
                        onChange={field.onChange}
                        application={selectedApplication ? {
                            id: selectedApplication.id,
                            name: selectedApplication.vacancy.title,
                            address: selectedApplication.vacancy.address,
                            image: selectedApplication.vacancy.image,
                            applicationStatus: selectedApplication.status,
                            categories: selectedApplication.vacancy.categories,
                        } : null}
                        isOpen={!!selectedApplication}
                        onClose={resetSelectedReview}
                        locale={locale}
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
