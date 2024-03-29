import React, { FC } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { Video } from "@/entities/Article";
import { useLocale } from "@/app/providers/LocaleProvider";
import like from "@/shared/assets/icons/thumbsUp.svg";
import comment from "@/shared/assets/icons/comment.svg";
import styles from "./VideoCard.module.scss";

interface VideoCardProps {
    video: Video;
    className?: string;
}

export const VideoCard: FC<VideoCardProps> = (props) => {
    const {
        video: {
            url, likes, comments, date, title, tag,
        }, className,
    } = props;
    const { locale } = useLocale();
    return (
        <Link className={styles.link} to={`/${locale}/video/1`}>
            <div className={cn(className, styles.wrapper)}>
                <ReactPlayer
                    style={{ pointerEvents: "none" }}
                    width="337px"
                    height="219px"
                    url={url}
                    light
                    playing={false}
                />
                <span className={styles.title}>{title}</span>
                <div className={styles.container}>
                    <span className={styles.date}>{date}</span>
                    <div className={styles.tag} style={{ backgroundColor: "#E0EBC6" }}>{tag}</div>
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
