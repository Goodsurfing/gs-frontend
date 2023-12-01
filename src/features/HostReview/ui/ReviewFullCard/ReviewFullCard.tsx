import { Rating } from "@mui/material";
import React, { FC } from "react";
import { ReviewCardInfo } from "@/types/review";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";

import styles from "./ReviewFullCard.module.scss";

interface ReviewFullCardProps {
    review: ReviewCardInfo;
}

export const ReviewFullCard: FC<ReviewFullCardProps> = (props: ReviewFullCardProps) => {
    const {
        review: {
            title, image, textReview, city, country,
        },
    } = props;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.avatarInfoUser}>
                    <img
                        className={styles.avatar}
                        src={defaultAvatarImage}
                        alt="AVATAR"
                    />
                    <div className={styles.userInfoContainer}>
                        <span className={styles.name}>
                            {title}
                        </span>
                        <span className={styles.address}>
                            {country}
                            {" "}
                            {city}
                        </span>
                    </div>
                </div>

                <div className={styles.ratingWrapper}>
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
                </div>
            </div>
            <p className={styles.textReview}>{textReview}</p>
        </div>
    );
};
