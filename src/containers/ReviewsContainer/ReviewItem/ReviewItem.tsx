import React, { FC } from "react";

import styles from "./ReviewItem.module.scss";

interface ReviewItemProps {
    title: string;
    text: string;
    image: string;
    author: string;
    avatar: string;
}

const ReviewItem: FC<ReviewItemProps> = ({
    title,
    text,
    image,
    avatar,
    author,
}) => (
    <div className={styles.wrapper}>
        <img src={image} alt={title} className={styles.image} />
        <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.text}>{text}</p>
            <div className={styles.user}>
                <img src={avatar} alt={author} className={styles.avatar} />
                <p className={styles.author}>{author}</p>
            </div>
        </div>
    </div>
);

export default ReviewItem;
