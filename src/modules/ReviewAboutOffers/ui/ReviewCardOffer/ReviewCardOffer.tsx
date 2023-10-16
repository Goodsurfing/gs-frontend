import React, { FC } from "react";
import { Rating } from "@mui/material";
import { ReviewOffer } from "../../model/types/reviewAboutOffers";
import defaultReviewPhoto from "@/shared/assets/images/reviews/review-photo-1.png";
import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";

import styles from "./ReviewCardOffer.module.scss";

interface ReviewCardOfferProps {
    reviewOffer: ReviewOffer
}

export const ReviewCardOffer: FC<ReviewCardOfferProps> = ({ reviewOffer }) => {
    const {
        author, authorAvatar, date, rating, textReview, title,
    } = reviewOffer;
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.titleImg}>
                    <span className={styles.title}>{title}</span>
                    <img
                        className={styles.img}
                        src={defaultReviewPhoto}
                        alt="offer"
                    />
                </div>
                <span className={styles.date}>24 мая 2020</span>
            </div>
            <p className={styles.textReview}>{textReview}</p>
            <div className={styles.ratingUserContainer}>
                <Rating
                    value={3}
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
                <span className={styles.ratingNum}>4.4</span>
                <div className={styles.avatarInfoUser}>
                    <img src={defaultAvatarImage} alt="AVATAR" />
                    <span className={styles.author}>{author}</span>
                </div>
            </div>
        </div>
    );
};
