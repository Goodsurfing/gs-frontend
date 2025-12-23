import React, { useCallback, useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";

import { NotesWidget } from "@/widgets/NotesWidget";

import {
    FormApplicationStatus,
    Application,
} from "@/entities/Application";
import { HostModalReview, useCreateVolunteerReviewMutation } from "@/entities/Review";
import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { ReviewFields } from "../../model/types/notes";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useLazyGetMyHostApplicationsQuery, useUpdateApplicationFormStatusByIdWithoutTagsMutation } from "@/entities/Chat";
import styles from "./NotesHostForm.module.scss";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

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
    const [toastTop, setToastTop] = useState<ToastAlert>();
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;
    const [selectedApplication,
        setSelectedApplication] = useState<Application | null>(null);

    const [adaptedApplications, setAdaptedApplications] = useState<Application[]>([]);
    const [page, setPage] = useState<number>(1);
    const [getApplications,
        { data: applicationData, isLoading }] = useLazyGetMyHostApplicationsQuery();
    const [createVolunteerReview] = useCreateVolunteerReviewMutation();
    const [updateApplicationStatus,
        { isLoading: updateApplicationLoading },
    ] = useUpdateApplicationFormStatusByIdWithoutTagsMutation();
    const { locale } = useLocale();

    const fetchApplications = useCallback(async (limit: number, pageItem: number) => {
        await getApplications({ limit, page: pageItem });
    }, [getApplications]);

    useEffect(() => {
        fetchApplications(APPLICATIONS_PER_PAGE, page);
    }, [fetchApplications, page]);

    useEffect(() => {
        if (applicationData) {
            setAdaptedApplications(applicationData.data);
        }
    }, [applicationData]);

    const totalPageCount = applicationData ? Math.ceil(
        applicationData.pagination.total / APPLICATIONS_PER_PAGE,
    ) : 0;

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
            try {
                await createVolunteerReview({
                    volunteerId: selectedApplication.volunteer.id,
                    rating: stars,
                    description: text,
                })
                    .unwrap();
                setToast({
                    text: t("hostNotes.Ваш отзыв был отправлен"),
                    type: HintType.Success,
                });
            } catch (error: unknown) {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            } finally {
                reset();
            }
        }
    });

    const handleUpdateStatus = async (
        applicationId: number,
        status: FormApplicationStatus,
    ) => {
        setToastTop(undefined);
        try {
            await updateApplicationStatus({ applicationId: applicationId.toString(), status })
                .unwrap();
        } catch {
            setToastTop({
                text: "Не удалось изменить статус заявки",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (
            <div><MiniLoader /></div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toastTop && <HintPopup text={toastTop.text} type={toastTop.type} />}
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
                        review={selectedApplication ? {
                            id: selectedApplication.volunteer.id,
                            firstName: selectedApplication.volunteer.firstName,
                            lastName: selectedApplication.volunteer.lastName,
                            image: selectedApplication.volunteer.image,
                            city: selectedApplication.volunteer.city,
                            country: selectedApplication.volunteer.country,
                            statusApplication: selectedApplication.status,
                        } : null}
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
