import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./NotesVolunteerForm.module.scss";
import { useCreateVolunteerReviewMutation } from "@/entities/Review/api/reviewApi";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { NotesWidget } from "@/widgets/NotesWidget";
import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";
import { RequestOfferCard } from "@/entities/Request";
import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { VolunteerReviewFields } from "../../model/types/notes";

export const NotesVolunteerForm = () => {
    const [toast, setToast] = useState<ToastAlert>();
    const form = useForm<VolunteerReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
        null,
    );
    const [createVolunteerReview] = useCreateVolunteerReviewMutation();

    const onReviewClick = (id: number) => {
        setSelectedReviewId(id);
    };

    const resetSelectedReview = () => {
        setSelectedReviewId(null);
    };

    const onSendReview = () => {
        if (selectedReviewId) {
            setToast(undefined);
            createVolunteerReview({})
                .unwrap()
                .then(() => {

                });
        }
    };

    return (
        <div>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <NotesWidget
                className={styles.notes}
                notes={mockedApplications}
                variant="volunteer"
                onReviewClick={onReviewClick}
                isDragDisable
            />
            <ModalReview
                isOpen={!!selectedReviewId}
                onClose={resetSelectedReview}
                titleText="Оставьте отзыв"
                sendReview={onSendReview}
            >
                <RequestOfferCard
                    application={mockedApplications[0]}
                    onReviewClick={onReviewClick}
                    showButtons={false}
                />
            </ModalReview>
        </div>
    );
};
