import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { useLocale } from "@/app/providers/LocaleProvider";

import { NotesWidget } from "@/widgets/NotesWidget";

import { SimpleFormApplication } from "@/entities/Application";
import { VolunteerModalReview } from "@/entities/Review";
import { useCreateToOrganizationsReviewMutation } from "@/entities/Review/api/reviewApi";

import { API_BASE_URL } from "@/shared/constants/api";
import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import { ReviewFields } from "../../model/types/notes";
import styles from "./NotesVolunteerForm.module.scss";
import { useLazyGetMyVolunteerApplicationsQuery } from "@/entities/Chat";

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
        setSelectedApplication] = useState<SimpleFormApplication | null>(null);

    const applicationsPerPage = 10;
    const [pageApplications, setPageApplications] = useState<
    SimpleFormApplication[]
    >([]);
    const [page, setPage] = useState<number>(1);
    const [getApplicationsData,
        { data: applications, isLoading }] = useLazyGetMyVolunteerApplicationsQuery();
    const [createToOrganizationReview] = useCreateToOrganizationsReviewMutation();

    useEffect(() => {
        getApplicationsData();
    }, [getApplicationsData]);

    useEffect(() => {
        if (applications) {
            // Тут получаю сначала новые заявки, по хорошему это надо делать на беке
            const reversed = [...applications].reverse();
            const startIndex = (page - 1) * applicationsPerPage;
            const endIndex = startIndex + applicationsPerPage;
            setPageApplications(reversed.slice(startIndex, endIndex));
        } else {
            setPageApplications([]);
        }
    }, [applications, page]);

    const totalPageCount = applications
        ? Math.ceil(applications.length / applicationsPerPage)
        : 0;

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (selectedApplicationId) {
    //             await getReviewData(selectedApplicationId.toString())
    //                 .unwrap()
    //                 .then((resultData) => {
    //                     const {
    //                         stars, text, applicationForm, id,
    //                     } = resultData;
    //                     reset({
    //                         review: {
    //                             stars,
    //                             text,
    //                             applicationForm,
    //                             id,
    //                         },
    //                     });
    //                 })
    //                 .catch(() => {
    //                     reset();
    //                 });
    //         }
    //     };
    //     fetchData();
    // }, [getReviewData, reset, selectedApplicationId]);

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

    return (
        <div className={styles.wrapper}>
            <NotesWidget
                className={styles.notes}
                notes={pageApplications}
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
                        application={selectedApplication}
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
