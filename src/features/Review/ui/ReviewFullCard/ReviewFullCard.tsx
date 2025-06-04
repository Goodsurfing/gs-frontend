/* eslint-disable react-hooks/rules-of-hooks */
import { Rating } from "@mui/material";
import React, { FC } from "react";

import styles from "./ReviewFullCard.module.scss";
import { ApplicationReviewResponse } from "@/entities/Review";
import { useGetHostByIdQuery } from "@/entities/Host";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";
import { getFullAddress, getFullName } from "@/shared/lib/getFullName";

interface ReviewFullCardProps {
    review: ApplicationReviewResponse;
    type: "volunteer" | "host";
}

export const ReviewFullCard: FC<ReviewFullCardProps> = (props: ReviewFullCardProps) => {
    const { review, type } = props;
    const {
        stars, text, organizationAuthorId, volunteerId,
    } = review;
    const skipVolunteerQuery = !volunteerId;
    const { data: volunteerData } = useGetVolunteerByIdQuery(volunteerId!, {
        skip: skipVolunteerQuery,
    });

    const skipHostQuery = !organizationAuthorId;
    const { data: hostData } = useGetHostByIdQuery(organizationAuthorId!, {
        skip: skipHostQuery,
    });

    if (!hostData || !volunteerData) {
        return null;
    }

    if (hostData && type === "host") {
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
    }

    if (volunteerData && type === "volunteer") {
        const { profile } = volunteerData;
        const {
            firstName, lastName, city, country, image,
        } = profile;
        const username = getFullName(firstName, lastName);
        const fullAddress = getFullAddress(city, country);

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
                                {username}
                            </span>
                            <span className={styles.address}>
                                {fullAddress}
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
    }

    return null;
};
