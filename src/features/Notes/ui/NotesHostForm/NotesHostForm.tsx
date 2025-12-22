import React, { useCallback, useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ErrorType } from "@/types/api/error";

import { NotesWidget } from "@/widgets/NotesWidget";

import {
    FormApplicationStatus,
    GetFormVolunteerApplication,
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
import { useLazyGetMyHostApplicationsQuery, useUpdateApplicationFormStatusByIdWithoutTagsMutation } from "@/entities/Chat";

const APPLICATIONS_PER_PAGE = 10;

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
        setSelectedApplication] = useState<GetFormVolunteerApplication | null>(null);

    const [adaptedApplications, setAdaptedApplications] = useState<SimpleFormApplication[]>([]);
    const [page, setPage] = useState<number>(1);
    const [getApplications,
        { data: applicationData, isLoading }] = useLazyGetMyHostApplicationsQuery();
    const [createToVolunteerReview] = useCreateToVolunteerReviewMutation();
    const [updateApplicationStatus,
        // eslint-disable-next-line max-len
        { isLoading: updateApplicationLoading }] = useUpdateApplicationFormStatusByIdWithoutTagsMutation();
    const { locale } = useLocale();

    const fetchApplications = useCallback(async (limit: number, pageItem: number) => {
        await getApplications({ limit, page: pageItem });
    }, [getApplications]);

    useEffect(() => {
        fetchApplications(APPLICATIONS_PER_PAGE, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if (applicationData) {
            const adapter: SimpleFormApplication[] = applicationData.data.map((application) => {
                const {
                    id, volunteer, chatId, vacancy, startDate, endDate, status,
                    hasFeedbackFromOrganization, hasFeedbackFromVolunteer,
                } = application;
                return {
                    id,
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
            setAdaptedApplications(adapter);
        }
    }, [applicationData]);

    const totalPageCount = applicationData ? Math.ceil(
        applicationData.pagination.total / APPLICATIONS_PER_PAGE,
    ) : 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onReviewClick = (application: SimpleFormApplication) => {
        // setSelectedApplication(application);
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

    const handleUpdateStatus = async (
        applicationId: number,
        status: FormApplicationStatus,
    ) => {
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
                notes={adaptedApplications}
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
                        review={null}
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
