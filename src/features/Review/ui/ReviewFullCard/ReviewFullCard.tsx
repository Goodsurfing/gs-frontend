import { Rating } from "@mui/material";
import React, { FC } from "react";

import styles from "./ReviewFullCard.module.scss";
import { ApplicationReviewResponse } from "@/entities/Review";
import { useGetHostByIdQuery } from "@/entities/Host";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

interface ReviewFullCardProps {
    review: ApplicationReviewResponse;
}

export const ReviewFullCard: FC<ReviewFullCardProps> = (props: ReviewFullCardProps) => {
    const { review } = props;
    const { stars, text, organizationAuthorId } = review;
    const { data: hostData } = useGetHostByIdQuery(organizationAuthorId ?? "");

    if (!hostData) {
        return null;
    }
    const { name, address, avatar } = hostData;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.avatarInfoUser}>
                    <Avatar
                        className={styles.avatar}
                        icon={getMediaContent(avatar)}
                        alt="AVATAR"
                    />
                    <div className={styles.userInfoContainer}>
                        <span className={styles.name}>
                            {name}
                        </span>
                        <span className={styles.address}>
                            {address}
                        </span>
                    </div>
                </div>

                <div className={styles.ratingWrapper}>
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
                </div>
            </div>
            <p className={styles.textReview}>{text}</p>
        </div>
    );
};
