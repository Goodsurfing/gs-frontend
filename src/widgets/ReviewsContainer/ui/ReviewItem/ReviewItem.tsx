import React, { FC } from "react";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./ReviewItem.module.scss";

interface ReviewItemProps {
    title: string;
    text: string;
    image: string;
    author: string;
    avatar?: string;
}

const ReviewItem: FC<ReviewItemProps> = ({
    title,
    text,
    image,
    avatar,
    author,
}) => (
    <div className={styles.wrapper}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.text}>{text}</p>
            <div className={styles.user}>
                <Avatar
                    size="SMALL"
                    icon={avatar}
                    text={author}
                    alt={author}
                    className={styles.avatar}
                />
                <p className={styles.author}>{author}</p>
            </div>
        </div>
    </div>
);

export default ReviewItem;
