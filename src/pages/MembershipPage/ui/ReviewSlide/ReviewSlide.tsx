import cn from "classnames";
import React, { FC, useState } from "react";

import rightIcon from "@/shared/assets/icons/review-right-icon.svg";
import defaultAvatar from "@/shared/assets/images/default-avatar.jpg";
import reviewIcon from "@/shared/assets/images/membership/review-photo.png";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./ReviewSlide.module.scss";

interface ReviewSlideProps {
    className?: string;
    title: string;
    reviewText: string;
}

export const ReviewSlide: FC<ReviewSlideProps> = (props: ReviewSlideProps) => {
    const { className, title, reviewText } = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxLength = 1033;
    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex + maxLength < reviewText.length;

    const scrollLeft = () => {
        if (canScrollLeft) {
            setCurrentIndex(currentIndex - maxLength);
        }
    };

    const scrollRight = () => {
        if (canScrollRight) {
            setCurrentIndex(currentIndex + maxLength);
        }
    };

    const renderText = (text: string) => text.slice(currentIndex, currentIndex + maxLength);

    return (
        <div className={cn(className, styles.wrapper)}>
            <img src={reviewIcon} alt="review" className={styles.image} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.pagination}>
                        <img
                            onClick={scrollLeft}
                            src={rightIcon}
                            alt="left"
                            className={cn(styles.left, {
                                [styles.disabledPagination]: !canScrollLeft,
                            })}
                        />
                        <img
                            onClick={scrollRight}
                            src={rightIcon}
                            alt="right"
                            className={cn(styles.right, {
                                [styles.disabledPagination]: !canScrollRight,
                            })}
                        />
                    </div>
                </div>
                <div className={styles.main}>
                    <p>{renderText(reviewText)}</p>
                </div>
                <div className={styles.user}>
                    <Avatar
                        icon={defaultAvatar}
                        alt="user avatar"
                        className={styles.avatar}
                    />
                    <span className={styles.username}>Тимур Шафеев</span>
                </div>
            </div>
        </div>
    );
};
