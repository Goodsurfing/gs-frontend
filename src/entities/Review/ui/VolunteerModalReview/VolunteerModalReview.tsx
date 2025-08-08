import React, { FC } from "react";

import { ReviewTypeFields } from "@/features/Notes";

import { RequestOfferCard, SimpleFormApplication } from "@/entities/Application";

import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";
import { Locale } from "@/entities/Locale";

interface VolunteerModalReviewProps {
    application: SimpleFormApplication | null;
    value: ReviewTypeFields;
    onChange: (value: ReviewTypeFields) => void;
    isOpen: boolean;
    onClose: () => void;
    sendReview: () => void;
    successText?: string;
    errorText?: string;
    locale: Locale;
}

export const VolunteerModalReview: FC<VolunteerModalReviewProps> = (props) => {
    const {
        application,
        value,
        onChange,
        isOpen,
        onClose,
        sendReview,
        successText,
        errorText,
        locale,
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
            {application && (
                <RequestOfferCard
                    application={application}
                    showButtons={false}
                    showStatus={false}
                    locale={locale}
                />
            )}
        </ModalReview>
    );
};
