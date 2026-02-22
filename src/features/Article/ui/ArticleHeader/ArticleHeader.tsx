import React, { FC } from "react";
import cn from "classnames";
import { HandySvg } from "@handy-ones/handy-svg";
import likesIcon from "@/shared/assets/icons/thumbsUp.svg";
import commentsIcon from "@/shared/assets/icons/comment.svg";
import CustomLink from "@/shared/ui/Link/Link";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import styles from "./ArticleHeader.module.scss";

interface ArticleHeaderProps {
    className?: string;
    title: string;
    authorId?: string;
    authorAvatar?: string;
    authorName?: string;
    date: string;
    category?: string;
    categoryColor?: string;
    likes: number;
    reviews: number;
    onLike?: () => void;
    locale: Locale;
}

export const ArticleHeader: FC<ArticleHeaderProps> = (props: ArticleHeaderProps) => {
    const {
        className, authorId, authorAvatar, authorName, category, date, title,
        categoryColor, onLike, likes, reviews, locale,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.containerHeader}>
                <div className={styles.infoWrapper}>
                    { (authorName && authorName && authorId) && (
                        <CustomLink
                            to={getVolunteerPersonalPageUrl(locale, authorId)}
                            variant="DEFAULT"
                            className={styles.author}
                        >
                            <img src={authorAvatar} alt="auhtor avatar" className={styles.avatar} />
                            <span className={styles.authorName}>{authorName}</span>
                        </CustomLink>
                    )}
                    <span className={styles.date}>{date}</span>
                    {(category && categoryColor) && (
                        <div
                            className={styles.category}
                            style={{ backgroundColor: categoryColor }}
                        >
                            {category}
                        </div>
                    )}
                </div>
                <div className={styles.containerIcon}>
                    <div className={cn(styles.wrapperIcon, styles.like)} onClick={onLike}>
                        <HandySvg src={likesIcon} className={styles.icon} />
                        <span className={styles.number}>{likes}</span>
                    </div>
                    <div className={styles.wrapperIcon}>
                        <HandySvg src={commentsIcon} className={styles.icon} />
                        <span className={styles.number}>{reviews}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
