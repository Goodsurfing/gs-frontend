import React, { FC } from "react";
import { Rating } from "@mui/material";

import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { MyReviewVolunteer } from "@/entities/Review";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getOfferPersonalPageUrl, getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { textSlice } from "@/shared/lib/textSlice";
import { useGetFullName } from "@/shared/lib/getFullName";
import styles from "./ReviewCardOffer.module.scss";

interface ReviewCardOfferProps {
    reviewOffer: MyReviewVolunteer;
    locale: Locale;
    className?: string;
}

export const ReviewCardOffer: FC<ReviewCardOfferProps> = (props: ReviewCardOfferProps) => {
    const { reviewOffer, locale, className } = props;
    const {
        vacancy, description, rating, created, author,
    } = reviewOffer;

    const { getFullName } = useGetFullName();
    const navigate = useNavigate();

    const navigateToVolunteer = () => {
        navigate(getVolunteerPersonalPageUrl(locale, author.id));
    };

    const navigateToOffer = () => {
        navigate(getOfferPersonalPageUrl(locale, vacancy.id.toString()));
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.header} onClick={navigateToOffer}>
                <div className={styles.titleImg}>
                    <span className={styles.title}>{textSlice(vacancy.name, 34, "title")}</span>
                    {vacancy.image?.thumbnails?.small ? (
                        <img
                            className={styles.img}
                            src={getMediaContent(vacancy.image?.thumbnails?.small)}
                            alt="offer"
                        />
                    ) : (
                        <div className={styles.noImg} />
                    )}
                </div>
                <span className={styles.date}>
                    {textSlice(created, 30, "none")}
                </span>
            </div>
            <p className={styles.textReview}>{description}</p>
            <div className={styles.ratingUserContainer}>
                <Rating
                    value={rating}
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
                <span className={styles.ratingNum}>{rating}</span>
                <div className={styles.avatarInfoUser} onClick={navigateToVolunteer}>
                    <Avatar icon={getMediaContent(author?.image?.thumbnails?.small)} alt="avatar" className={styles.avatar} />
                    <span className={styles.author}>
                        {textSlice(`${getFullName(author?.firstName, author?.lastName)}`, 50, "title")}
                    </span>
                </div>
            </div>
        </div>
    );
};
