import React, { useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { NotesWidget } from "@/widgets/NotesWidget";

import {
    FormApplicationStatus,
    FullFormApplication,
    useGetMyHostApplicationsQuery,
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
import { useUpdateApplicationFormStatusByIdMutation } from "@/entities/Application/api/applicationApi";
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

    const { data: applications, isLoading } = useGetMyHostApplicationsQuery();
    const [createToVolunteerReview] = useCreateToVolunteerReviewMutation();
    const [updateApplicationStatus] = useUpdateApplicationFormStatusByIdMutation();
    const { locale } = useLocale();

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
        if (selectedApplication) {
            setToast(undefined);
            const formData = new FormData();
            formData.append(
                "applicationForm",
                `${API_BASE_URL}application_forms/${selectedApplication.id.toString()}`,
            );
            if (stars) formData.append("stars", stars.toString());
            formData.append("text", text);
            await createToVolunteerReview(formData)
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
        <div>
            <NotesWidget
                className={styles.notes}
                notes={applications ?? []}
                variant="host"
                onReviewClick={onReviewClick}
                updateApplicationStatus={handleUpdateStatus}
                isDragDisable={false}
                locale={locale}
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
                    />
                )}
            />
        </div>
    );
};
