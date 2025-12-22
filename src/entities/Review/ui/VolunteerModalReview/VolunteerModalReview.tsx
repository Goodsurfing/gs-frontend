import React, { FC } from "react";

import { ReviewTypeFields } from "@/features/Notes";
import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";
import { Locale } from "@/entities/Locale";
import { NotDoneReviewVolunteer } from "../../model/types/review";
import { MiniOfferReview } from "../MiniOfferReview/MiniOfferReview";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface VolunteerModalReviewProps {
    application: NotDoneReviewVolunteer | null;
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
                <MiniOfferReview
                    data={{
                        offerId: application.id,
                        name: application.name,
                        image: getMediaContent(application.image.contentUrl) ?? "",
                        address: application.address,
                        applicationStatus: application.applicationStatus,
                        categoryName: application.categories[0]?.name,
                    }}
                    locale={locale}
                />
            )}
        </ModalReview>
    );
};
