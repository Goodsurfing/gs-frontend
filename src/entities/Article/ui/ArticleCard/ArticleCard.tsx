import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import comment from "@/shared/assets/icons/comment.svg";
import like from "@/shared/assets/icons/thumbsUp.svg";

import { GetNewsList } from "@/entities/News";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
    article: GetNewsList;
    className?: string;
    path: string;
}

export const ArticleCard: FC<ArticleCardProps> = memo(
    (props: ArticleCardProps) => {
        const {
            article: {
                image, name, category, created,
                likeCount, reviewCount,
            },
            className,
            path,
        } = props;

        return (
            <Link className={styles.link} to={path}>
                <div className={cn(className, styles.wrapper)}>
                    <img
                        className={styles.image}
                        src={getMediaContent(image.contentUrl)}
                        alt={name}
                    />
                    <span className={styles.title}>{name}</span>
                    <div className={styles.container}>
                        <span className={styles.date}>{created}</span>
                        <div
                            className={styles.tag}
                            style={{ backgroundColor: category.color }}
                        >
                            {category.name}
                        </div>
                    </div>
                    <p className={styles.description}>
                        {/* {description.substring(0, 300)} */}
                    </p>
                    <div className={styles.infoContainer}>
                        <img
                            className={styles.likeIcon}
                            src={like}
                            alt="likes"
                        />
                        <span className={styles.textStats}>{likeCount}</span>
                        <img
                            className={styles.commentIcon}
                            src={comment}
                            alt="comments"
                        />
                        <span className={styles.textStats}>{reviewCount}</span>
                    </div>
                </div>
            </Link>
        );
    },
);
