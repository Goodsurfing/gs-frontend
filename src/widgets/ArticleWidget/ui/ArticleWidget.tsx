import React, { FC, memo } from "react";

import cn from "classnames";
import { Link } from "react-router-dom";
import { Article } from "@/entities/Article";
import like from "@/shared/assets/icons/thumbsUp.svg";
import comment from "@/shared/assets/icons/comment.svg";
import styles from "./ArticleWidget.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface ArticleWidgetProps {
    article: Article;
    className?: string;
}

export const ArticleWidget: FC<ArticleWidgetProps> = memo((
    props: ArticleWidgetProps,
) => {
    const {
        article: {
            image, title, description, date, likes, comments, tag,
        },
        className,
    } = props;
    const { locale } = useLocale();

    return (
        <div className={cn(className, styles.wrapper)}>
            <Link to={`/${locale}/news/1`}>
                <img className={styles.image} src={image} alt={title} />
                <span className={styles.title}>{title}</span>
                <div className={styles.container}>
                    <span className={styles.date}>{date}</span>
                    <div className={styles.tag} style={{ backgroundColor: "#E0EBC6" }}>{tag}</div>
                </div>
                <p className={styles.description}>{description.substring(0, 300)}</p>
                <div className={styles.infoContainer}>
                    <img className={styles.likeIcon} src={like} alt="likes" />
                    <span className={styles.textStats}>{likes}</span>
                    <img className={styles.commentIcon} src={comment} alt="comments" />
                    <span className={styles.textStats}>{comments}</span>
                </div>
            </Link>
        </div>
    );
});
