import React, { FC } from "react";
import cn from "classnames";
import styles from "./ArticleHeader.module.scss";

interface ArticleHeaderProps {
    className?: string;
    title: string;
    authorAvatar: string;
    authorName: string;
    date: string;
    category: string;
}

export const ArticleHeader: FC<ArticleHeaderProps> = (props: ArticleHeaderProps) => {
    const {
        className, authorAvatar, authorName, category, date, title,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <h1 className={styles.title}>{title}</h1>
            <div>
                <div className={styles.infoWrapper}>
                    <div className={styles.author}>
                        <img src={authorAvatar} alt="auhtor avatar" className={styles.avatar} />
                        <span className={styles.authorName}>{authorName}</span>
                    </div>
                    <span className={styles.date}>{date}</span>
                    <div className={styles.category}>{category}</div>
                </div>
            </div>
        </div>
    );
};
