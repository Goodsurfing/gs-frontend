import React, { FC, memo } from "react";

import { useNavigate } from "react-router-dom";
import star from "@/shared/assets/icons/offers/star.svg";
import deleteIcon from "@/shared/assets/icons/delete.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { ReviewGallery } from "@/shared/ui/ReviewGallery/ReviewGallery";
import { Image } from "@/types/media";

import styles from "./ReviewWidget.module.scss";

interface ReviewWidgetProps {
    reviewText: string;
    stars: number;
    avatar?: string;
    name: string;
    url: string;
    images?: Image[];
    canDelete?: boolean;
    onDelete?: () => void;
}

export const ReviewWidget: FC<ReviewWidgetProps> = memo(
    (props: ReviewWidgetProps) => {
        const {
            reviewText, stars, name, avatar, url, images, canDelete, onDelete,
        } = props;
        const navigate = useNavigate();

        const navigateTo = () => {
            navigate(url);
        };

        return (
            <div className={styles.wrapper}>
                {canDelete && (
                    <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={onDelete}
                        aria-label="Удалить отзыв"
                    >
                        <img src={deleteIcon} alt="Удалить" />
                    </button>
                )}
                <p className={styles.reviewText}>{reviewText}</p>
                <ReviewGallery images={images} />
                <div className={styles.reviewInfo}>
                    <div className={styles.ratingContainer}>
                        <img src={star} alt="rating" />
                        <span className={styles.rating}>{stars}</span>
                    </div>
                    <Avatar
                        icon={avatar}
                        text={name}
                        className={styles.avatar}
                        onClick={navigateTo}
                    />
                    <span className={styles.name} onClick={navigateTo}>{name}</span>
                    {/* <span className={styles.date}>
                        /
                        {" "}
                        {date}
                    </span> */}
                </div>
            </div>
        );
    },
);
