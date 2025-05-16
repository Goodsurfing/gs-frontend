import React, { FC } from "react";
import { Rating } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { ApplicationReviewResponse } from "@/entities/Review";
import { useGetApplicationFormByIdQuery } from "@/entities/Application";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getOfferPersonalPageUrl, getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { textSlice } from "@/shared/lib/textSlice";
import { getFullName } from "@/shared/lib/getFullName";
import styles from "./ReviewCardOffer.module.scss";

interface ReviewCardOfferProps {
    reviewOffer: ApplicationReviewResponse;
    locale: Locale;
}

export const ReviewCardOffer: FC<ReviewCardOfferProps> = (props: ReviewCardOfferProps) => {
    const { reviewOffer, locale } = props;
    const {
        applicationForm, stars, text, vacancyId,
    } = reviewOffer;
    const partsApplicationUrl = applicationForm.split("/");
    const applicationId = partsApplicationUrl.pop();
    const { data: applicationData } = useGetApplicationFormByIdQuery(applicationId ?? "");
    const navigate = useNavigate();

    if (!applicationData) {
        return null;
    }
    const { vacancy, volunteer } = applicationData;

    const navigateToVolunteer = () => {
        navigate(getVolunteerPersonalPageUrl(locale, volunteer.profile.id));
    };

    const navigateToOffer = () => {
        if (vacancyId) {
            navigate(getOfferPersonalPageUrl(locale, vacancyId.toString()));
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header} onClick={navigateToOffer}>
                <div className={styles.titleImg}>
                    <span className={styles.title}>{vacancy.description?.title}</span>
                    <img
                        className={styles.img}
                        src={getMediaContent(vacancy.description?.image)}
                        alt="offer"
                    />
                </div>
                <span className={styles.date}>
                    {textSlice(vacancy.description?.shortDescription, 30, "none")}
                </span>
            </div>
            <p className={styles.textReview}>{text}</p>
            <div className={styles.ratingUserContainer}>
                <Rating
                    value={stars}
                    readOnly
                    sx={{
                        "& .MuiRating-iconFilled": {
                            color: "#FED81C",
                        },

                        "& .MuiRating-icon": {
                            fontSize: "15px",
                        },
                    }}
                />
                <span className={styles.ratingNum}>{stars}</span>
                <div className={styles.avatarInfoUser} onClick={navigateToVolunteer}>
                    <Avatar icon={getMediaContent(volunteer.profile.image)} alt="avatar" className={styles.avatar} />
                    <span className={styles.author}>
                        {textSlice(`${getFullName(volunteer.profile.firstName, volunteer.profile.lastName)}`, 50, "title")}
                    </span>
                </div>
            </div>
        </div>
    );
};
