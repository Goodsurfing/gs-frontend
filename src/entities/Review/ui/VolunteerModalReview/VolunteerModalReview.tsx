import React, { FC } from "react";
import { Application } from "@/entities/Host";
import { RequestOfferCard } from "@/entities/Request";
import { VolunteerReviewTypeFields } from "@/features/Notes/model/types/notes";
import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";

interface VolunteerModalReviewProps {
    application: Application;
    value: VolunteerReviewTypeFields;
    onChange: (value: VolunteerReviewTypeFields) => void;
    isOpen: boolean;
    onClose: () => void;
    sendReview: () => void;
    successText?: string;
    errorText?: string;
}

export const VolunteerModalReview: FC<VolunteerModalReviewProps> = (props) => {
    const {
        application, value, onChange, isOpen, onClose, sendReview, successText, errorText,
    } = props;
    const { stars, text } = value;
    return (
        <ModalReview
            value={{ stars, text }}
            onChange={(valueItem) => onChange({
                ...value,
                stars: valueItem.stars,
                text: valueItem.text,
            })}
            isOpen={isOpen}
            onClose={onClose}
            titleText="Оставьте отзыв"
            sendReview={sendReview}
            successText={successText}
            errorText={errorText}
        >
            <RequestOfferCard
                application={application}
                showButtons={false}
                showStatus={false}
            />
        </ModalReview>
    );
};
