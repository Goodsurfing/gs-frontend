import React, { useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";

import { NotesWidget } from "@/widgets/NotesWidget";

import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { HostModalReview } from "@/entities/Review";

import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { VolunteerReviewFields } from "../../model/types/notes";
import styles from "./NotesHostForm.module.scss";
import { useGetMyHostApplicationsQuery } from "@/entities/Host";

export const NotesHostForm = () => {
    const defaultValues: DefaultValues<VolunteerReviewFields> = {
        volunteerReview: {
            stars: undefined,
            text: "",
        },
    };

    const [toast] = useState<ToastAlert>();
    const form = useForm<VolunteerReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control } = form;
    const { data: applications } = useGetMyHostApplicationsQuery();
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
        null,
    );

    const onReviewClick = (id: number) => {
        setSelectedReviewId(id);
    };

    const resetSelectedReview = () => {
        setSelectedReviewId(null);
    };

    const onSendReview = handleSubmit(() => {
    });

    return (
        <div>
            <NotesWidget
                className={styles.notes}
                notes={applications ?? []}
                variant="host"
                onReviewClick={onReviewClick}
                isDragDisable
            />
            <Controller
                name="volunteerReview"
                control={control}
                render={({ field }) => (
                    <HostModalReview
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
