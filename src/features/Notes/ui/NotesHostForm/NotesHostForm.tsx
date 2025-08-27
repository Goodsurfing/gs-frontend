import React, { useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ErrorType } from "@/types/api/error";

import { NotesWidget } from "@/widgets/NotesWidget";

import {
    FormApplicationStatus,
    SimpleFormApplication,
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
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useLazyGetMyHostApplicationsQuery, useUpdateApplicationFormStatusByIdMutation } from "@/entities/Chat";

export const NotesHostForm = () => {
    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };

    const { t } = useTranslation("host");
    const [toast, setToast] = useState<ToastAlert>();
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;
    const [selectedApplication,
        setSelectedApplication] = useState<SimpleFormApplication | null>(null);

    const applicationsPerPage = 10;
    const [applications, setApplications] = useState<SimpleFormApplication[]>([]);
    const [pageApplications, setPageApplications] = useState<SimpleFormApplication[]>([]);
    const [page, setPage] = useState<number>(1);
    const [getApplications, { isLoading }] = useLazyGetMyHostApplicationsQuery();
    const [createToVolunteerReview] = useCreateToVolunteerReviewMutation();
    const [updateApplicationStatus,
        { isLoading: updateApplicationLoading }] = useUpdateApplicationFormStatusByIdMutation();
    const { locale } = useLocale();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const result = await getApplications().unwrap();
                setApplications(result);
            } catch { /* empty */ }
        };

        fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const totalPageCount = applications ? Math.ceil(applications.length / applicationsPerPage) : 0;

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
                        text: t("hostNotes.Ваш отзыв был отправлен"),
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

    const handleUpdateStatus = async (applicationId: number, status: FormApplicationStatus) => {
        await updateApplicationStatus({ applicationId: applicationId.toString(), status })
            .unwrap()
            .catch(() => {
                // empty
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
                isDragDisable={updateApplicationLoading || isLoading}
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
                        titleText={t("hostNotes.Оставьте отзыв")}
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
