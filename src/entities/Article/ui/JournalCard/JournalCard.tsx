import cn from "classnames";
import React, { FC } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Journal } from "@/entities/Article";

import comment from "@/shared/assets/icons/comment.svg";
import like from "@/shared/assets/icons/thumbsUp.svg";

import styles from "./JournalCard.module.scss";

interface JournalCardProps {
    journal: Journal;
    className?: string;
}

export const JournalCard: FC<JournalCardProps> = (props) => {
    const {
        journal: {
            title, description, date, comments, image, likes,
        },
        className,
    } = props;
    const { locale } = useLocale();
    return (
        <div className={cn(className, styles.wrapper)}>
            <Link to={`/${locale}/journals/1`}>
                <img className={styles.image} src={image} alt={title} />
                <span className={styles.title}>{title}</span>
                <div className={styles.container}>
                    <span className={styles.date}>{date}</span>
                </div>
                <p className={styles.description}>
                    {description.substring(0, 200)}
                </p>
                <div className={styles.infoContainer}>
                    <img className={styles.likeIcon} src={like} alt="likes" />
                    <span className={styles.textStats}>{likes}</span>
                    <img
                        className={styles.commentIcon}
                        src={comment}
                        alt="comments"
                    />
                    <span className={styles.textStats}>{comments}</span>
                </div>
            </Link>
        </div>
    );
};
