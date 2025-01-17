import React, { useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Pagination } from "@mui/material";
import { ErrorType } from "@/types/api/error";

import { NotesWidget } from "@/widgets/NotesWidget";

import {
    FormApplicationStatus,
    FullFormApplication,
} from "@/entities/Application";
import { HostModalReview } from "@/entities/Review";
import { useCreateToVolunteerReviewMutation } from "@/entities/Review/api/reviewApi";

import { API_BASE_URL } from "@/shared/constants/api";
import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { ReviewFields } from "../../model/types/notes";
import styles from "./NotesHostForm.module.scss";
import { useLazyGetMyHostApplicationsQuery, useUpdateApplicationFormStatusByIdMutation } from "@/entities/Application/api/applicationApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";

export const NotesHostForm = () => {
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
    const { handleSubmit, control } = form;
    const [selectedApplication,
        setSelectedApplication] = useState<FullFormApplication | null>(null);

    const applicationsPerPage = 10;
    const [pageApplications, setPageApplications] = useState<FullFormApplication[]>([]);
    const [page, setPage] = useState<number>(1);
    const [getApplicationsData,
        { data: applications, isLoading }] = useLazyGetMyHostApplicationsQuery();
    const [createToVolunteerReview] = useCreateToVolunteerReviewMutation();
    const [updateApplicationStatus,
        { isLoading: updateApplicationLoading }] = useUpdateApplicationFormStatusByIdMutation();
    const { locale } = useLocale();

    useEffect(() => {
        getApplicationsData();
    }, [getApplicationsData]);

    useEffect(() => {
        if (applications) {
            const startIndex = (page - 1) * applicationsPerPage;
            const endIndex = startIndex + applicationsPerPage;
            setPageApplications(applications.slice(startIndex, endIndex));
        } else {
            setPageApplications([]);
        }
    }, [applications, page]);

    const totalPageCount = applications ? Math.ceil(applications.length / applicationsPerPage) : 0;

    const onReviewClick = (application: FullFormApplication) => {
        setSelectedApplication(application);
    };

    const resetSelectedReview = () => {
        setSelectedApplication(null);
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
                        text: "Ваш отзыв был отправлен",
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        }
    });

    const handleUpdateStatus = (applicationId: number, status: FormApplicationStatus) => {
        updateApplicationStatus({ applicationId: applicationId.toString(), status })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Статус был отправлен",
                    type: HintType.Success,
                });
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
    };

    if (isLoading) {
        return (
            <div><MiniLoader /></div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <NotesWidget
                className={styles.notes}
                notes={pageApplications}
                variant="host"
                onReviewClick={onReviewClick}
                updateApplicationStatus={handleUpdateStatus}
                isDragDisable={updateApplicationLoading}
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
                    <HostModalReview
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
