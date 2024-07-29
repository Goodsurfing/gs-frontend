import React, { FC } from "react";
import cn from "classnames";
import styles from "./Comment.module.scss";

interface CommentProps {
    className?: string;
    comment: string;
    authorAvatar: string;
    authorName: string;
    date: string;
}

export const Comment: FC<CommentProps> = (props: CommentProps) => {
    const {
        className, authorAvatar, authorName, comment, date,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.comment}>{comment}</span>
            <div className={styles.wrapperInfo}>
                <div className={styles.wrapperAuthor}>
                    <img src={authorAvatar} alt="" className={styles.authorAvatar} />
                    <span className={styles.authorName}>{authorName}</span>
                </div>
                <span className={styles.date}>
                    /
                    {date}
                </span>
            </div>
        </div>
    );
};
