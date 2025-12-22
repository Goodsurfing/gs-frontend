import { Rating } from "@mui/material";
import React, { FC } from "react";

import { MyReviewHost } from "@/entities/Review";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { getFullAddress, useGetFullName } from "@/shared/lib/getFullName";
import styles from "./ReviewFullCard.module.scss";

interface ReviewFullCardProps {
    review: MyReviewHost;
}

export const ReviewFullCard: FC<ReviewFullCardProps> = (props: ReviewFullCardProps) => {
    const { review } = props;
    const {
        description, rating,
        volunteer,
    } = review;
    const { getFullName } = useGetFullName();
    const userName = getFullName(volunteer.firstName, volunteer.lastName);
    const image = getMediaContent(volunteer.image.thumbnails?.small);
    const fullAddress = getFullAddress(volunteer.city, volunteer.country);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.avatarInfoUser}>
                    <Avatar
                        className={styles.avatar}
                        icon={getMediaContent(image)}
                        alt="AVATAR"
                    />
                    <div className={styles.userInfoContainer}>
                        <span className={styles.name}>
                            {userName}
                        </span>
                        <span className={styles.address}>
                            {fullAddress}
                        </span>
                    </div>
                </div>

                <div className={styles.ratingWrapper}>
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
                </div>
            </div>
            <p className={styles.textReview}>{description}</p>
        </div>
    );
};
