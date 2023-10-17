import { Rating } from "@mui/material";
import React, { FC } from "react";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";

import { UserCardFullInfo } from "../../model/types/hostReview";
import styles from "./ReviewFullCard.module.scss";

interface ReviewFullCardProps {
    review: UserCardFullInfo;
}

export const ReviewFullCard: FC<ReviewFullCardProps> = ({ review }) => {
    const {
        userInfo: {
            avatar, city, country, name, surname,
        }, textReview,
    } = review;

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
                            {name}
                            {" "}
                            {surname}
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
