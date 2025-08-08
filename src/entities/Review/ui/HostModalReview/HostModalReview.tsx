import React, { FC } from "react";

import { ReviewTypeFields } from "@/features/Notes";

import { RequestCard, SimpleFormApplication } from "@/entities/Application";

import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";
import { Locale } from "@/entities/Locale";

interface HostModalReviewProps {
    application: SimpleFormApplication | null;
    value: ReviewTypeFields;
    onChange: (value: ReviewTypeFields) => void;
    isOpen: boolean;
    onClose: () => void;
    sendReview: () => void;
    titleText: string;
    successText?: string;
    errorText?: string;
    locale: Locale;
}

export const HostModalReview: FC<HostModalReviewProps> = (props) => {
    const {
        application,
        value,
        onChange,
        isOpen,
        onClose,
        sendReview,
        titleText,
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
            titleText={titleText}
            sendReview={sendReview}
            successText={successText}
            errorText={errorText}
        >
            {application && (
                <RequestCard
                    locale={locale}
                    application={application}
                    showButtons={false}
                    showStatus={false}
                />
            )}
        </ModalReview>
    );
};
