import React, { FC } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import like from "@/shared/assets/icons/thumbsUp.svg";
import comment from "@/shared/assets/icons/comment.svg";
import useWindowDimensions from "@/shared/hooks/useWindowDimensions";
import styles from "./VideoCard.module.scss";

export interface VideoCardType {
    id: string;
    likes: number;
    comments: number;
    date: string;
    title: string;
    tag: { name: string; color: string };
    image?: string;
}

interface VideoCardProps {
    video: VideoCardType;
    className?: string;
}

export const VideoCard: FC<VideoCardProps> = (props) => {
    const {
        video: {
            likes, comments, date, title, tag, image, id,
        }, className,
    } = props;
    const { locale } = useLocale();
    const { width } = useWindowDimensions();
    return (
        <Link className={styles.link} to={`/${locale}/video/${id}`}>
            <div className={cn(className, styles.wrapper)}>
                {image ? (
                    <img
                        src={image}
                        className={styles.image}
                        style={{ width: width <= 576 ? "100%" : "337px", height: 190 }}
                        alt="preview"
                    />
                ) : (
                    <div
                        className={styles.noImage}
                        style={{ width: width <= 576 ? "100%" : "337px", height: 190 }}
                    />
                )}
                <span className={styles.title}>{title}</span>
                <div className={styles.container}>
                    <span className={styles.date}>{date}</span>
                    <div
                        className={styles.tag}
                        style={{ backgroundColor: tag.color }}
                    >
                        {tag.name}
                    </div>
                </div>
                <div className={styles.infoContainer}>
                    <img className={styles.likeIcon} src={like} alt="likes" />
                    <span className={styles.textStats}>{likes}</span>
                    <img className={styles.commentIcon} src={comment} alt="comments" />
                    <span className={styles.textStats}>{comments}</span>
                </div>
            </div>
        </Link>
    );
};
