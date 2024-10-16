import React, { useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { NotesWidget } from "@/widgets/NotesWidget";

import { FullFormApplication } from "@/entities/Application";
import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { VolunteerModalReview } from "@/entities/Review";
import {
    useCreateToOrganizationsReviewMutation,
    useLazyGetToOrganizationsReviewByIdQuery,
    useLazyGetToVolunteerReviewByIdQuery,
    useUpdateToOrganizationsReviewByIdMutation,
} from "@/entities/Review/api/reviewApi";

import { API_BASE_URL } from "@/shared/constants/api";
import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { ReviewFields } from "../../model/types/notes";
import styles from "./NotesVolunteerForm.module.scss";

export const NotesVolunteerForm = () => {
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
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
        null,
    );
    const [getReviewData] = useLazyGetToOrganizationsReviewByIdQuery();
    const [createToOrganizationReview] = useCreateToOrganizationsReviewMutation();
    const [updateToOrganizationReview] = useUpdateToOrganizationsReviewByIdMutation();

    useEffect(() => {
        const fetchData = async () => {
            if (selectedReviewId) {
                await getReviewData(selectedReviewId.toString())
                    .unwrap()
                    .then((resultData) => {
                        const {
                            stars, text, applicationForm, id,
                        } = resultData;
                        reset({
                            review: {
                                stars,
                                text,
                                applicationForm,
                                id,
                            },
                        });
                    })
                    .catch(() => {
                        reset();
                    });
            }
        };
        fetchData();
    }, [getReviewData, reset, selectedReviewId]);

    const onReviewClick = (application: FullFormApplication) => {
        setSelectedReviewId(application.id);
    };

    const resetSelectedReview = () => {
        setSelectedReviewId(null);
    };

    const onSendReview = handleSubmit(async (data) => {
        const {
            review: { stars, text },
        } = data;
        if (selectedReviewId) {
            setToast(undefined);
            const getReviewDataResult = await getReviewData(
                selectedReviewId.toString(),
            )
                .unwrap()
                .then((resultData) => resultData)
                .catch(() => undefined);

            if (!getReviewDataResult) {
                const formData = new FormData();
                formData.append("applicationForm", `${API_BASE_URL}application_forms/${selectedReviewId.toString()}`);
                if (stars) formData.append("stars", stars.toString());
                formData.append("text", text);
                await createToOrganizationReview(formData)
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
            } else {
                await updateToOrganizationReview({
                    reviewId: selectedReviewId.toString(),
                    data: {
                        
                    }
                    applicationForm: `${API_BASE_URL}application_forms/${selectedReviewId.toString()}`,
                    stars,
                    text,
                })
                    .unwrap()
                    .then(() => {
                        setToast({
                            text: "Ваш отзыв был изменён",
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
        }
    });

    return (
        <div>
            <NotesWidget
                className={styles.notes}
                notes={mockedApplications}
                variant="volunteer"
                onReviewClick={onReviewClick}
                isDragDisable
            />
            <Controller
                name="review"
                control={control}
                render={({ field }) => (
                    <VolunteerModalReview
                        value={field.value}
                        onChange={field.onChange}
                        application={mockedApplications[0]}
                        isOpen={!!selectedReviewId}
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
