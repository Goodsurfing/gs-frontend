import React, { FC } from "react";
import { Application } from "@/entities/Host";
import { RequestCard } from "@/entities/Request";
import { HostReviewTypeFields } from "@/features/Notes";
import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";

interface HostModalReviewProps {
    application: Application;
    value: HostReviewTypeFields;
    onChange: (value: HostReviewTypeFields) => void;
    isOpen: boolean;
    onClose: () => void;
    sendReview: () => void;
    successText?: string;
    errorText?: string;
}

export const HostModalReview: FC<HostModalReviewProps> = (props) => {
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
            <RequestCard
                application={application}
                showButtons={false}
                showStatus={false}
            />
        </ModalReview>
    );
};
