import React, { useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { NotesWidget } from "@/widgets/NotesWidget";

import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { VolunteerModalReview } from "@/entities/Review";
import {
    useCreateVolunteerReviewMutation,
    useLazyGetVolunteerReviewByIdQuery,
} from "@/entities/Review/api/reviewApi";

import { API_BASE_URL } from "@/shared/constants/api";
import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { VolunteerReviewFields } from "../../model/types/notes";
import styles from "./NotesVolunteerForm.module.scss";

export const NotesVolunteerForm = () => {
    const defaultValues: DefaultValues<VolunteerReviewFields> = {
        volunteerReview: {
            stars: undefined,
            text: "",
        },
    };

    const [toast, setToast] = useState<ToastAlert>();
    const form = useForm<VolunteerReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;
    const [getReviewData] = useLazyGetVolunteerReviewByIdQuery();
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
        null,
    );
    const [createVolunteerReview] = useCreateVolunteerReviewMutation();

    useEffect(() => {
        const fetchData = async () => {
            if (selectedReviewId) {
                getReviewData(
                    selectedReviewId.toString(),
                )
                    .unwrap()
                    .then((resutlData) => {
                        const {
                            stars, text, applicationForm, id,
                        } = resutlData;
                        reset({
                            volunteerReview: {
                                stars, text, applicationForm, id,
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

    const onReviewClick = (id: number) => {
        setSelectedReviewId(id);
    };

    const resetSelectedReview = () => {
        setSelectedReviewId(null);
    };

    const onSendReview = handleSubmit(async (data) => {
        const {
            volunteerReview: { stars, text },
        } = data;
        if (selectedReviewId) {
            setToast(undefined);
            await createVolunteerReview({
                applicationForm: `${API_BASE_URL}application_forms/${selectedReviewId.toString()}`,
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
                name="volunteerReview"
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
