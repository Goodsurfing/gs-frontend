import React, { FC } from "react";
import { Rating } from "@mui/material";
import { GetAboutVolunteerReview } from "@/entities/Review";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { getFullAddress, getFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./ReviewAboutVolunteerCard.module.scss";

interface ReviewAboutVolunteerCardProps {
    data: GetAboutVolunteerReview;
}

export const ReviewAboutVolunteerCard: FC<ReviewAboutVolunteerCardProps> = (props) => {
    const { data } = props;
    const { author, description, rating } = data;
    const username = getFullName(author.firstName, author.lastName);
    const fullAddress = getFullAddress(author.city, author.country);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.avatarInfoUser}>
                    <Avatar
                        className={styles.avatar}
                        icon={getMediaContent(author.imagePath)}
                        alt="AVATAR"
                    />
                    <div className={styles.userInfoContainer}>
                        <span className={styles.name}>
                            {username}
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
