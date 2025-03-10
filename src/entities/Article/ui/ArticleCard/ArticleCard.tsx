import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import { Article } from "@/entities/Article";

import comment from "@/shared/assets/icons/comment.svg";
import like from "@/shared/assets/icons/thumbsUp.svg";

import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
    article: Article;
    className?: string;
    path: string;
}

export const ArticleCard: FC<ArticleCardProps> = memo(
    (props: ArticleCardProps) => {
        const {
            article: {
                image, title, description, date, likes, comments, tag,
            },
            className,
            path,
        } = props;

        return (
            <Link className={styles.link} to={path}>
                <div className={cn(className, styles.wrapper)}>
                    <img className={styles.image} src={image} alt={title} />
                    <span className={styles.title}>{title}</span>
                    <div className={styles.container}>
                        <span className={styles.date}>{date}</span>
                        <div
                            className={styles.tag}
                            style={{ backgroundColor: "#E0EBC6" }}
                        >
                            {tag}
                        </div>
                    </div>
                    <p className={styles.description}>
                        {description.substring(0, 300)}
                    </p>
                    <div className={styles.infoContainer}>
                        <img
                            className={styles.likeIcon}
                            src={like}
                            alt="likes"
                        />
                        <span className={styles.textStats}>{likes}</span>
                        <img
                            className={styles.commentIcon}
                            src={comment}
                            alt="comments"
                        />
                        <span className={styles.textStats}>{comments}</span>
                    </div>
                </div>
            </Link>
        );
    },
);
