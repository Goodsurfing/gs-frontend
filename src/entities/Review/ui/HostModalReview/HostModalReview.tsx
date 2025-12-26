import React, { FC } from "react";

import { ReviewTypeFields } from "@/features/Notes";

import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";
import { Locale } from "@/entities/Locale";
import { NotDoneReviewHost } from "../../model/types/review";
import { MiniVolunteerReview } from "../MiniVolunteerReview/MiniVolunteerReview";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface HostModalReviewProps {
    review: NotDoneReviewHost | null;
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
        review,
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
            {review && (
                <MiniVolunteerReview
                    data={{
                        volunteerId: review.id,
                        firstName: review.firstName,
                        lastName: review.lastName,
                        image: getMediaContent(review.image?.thumbnails?.small),
                        city: review.city,
                        country: review.country,
                        applicationStatus: review.statusApplication,
                    }}
                    locale={locale}
                />
            )}
        </ModalReview>
    );
};
