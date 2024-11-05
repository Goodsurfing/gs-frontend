import React from "react";
import ReactPlayer from "react-player";

import { useTranslation } from "react-i18next";
import { VideoListProps } from "@/widgets/VideoList";

import styles from "./VideoList.module.scss";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";

export const VideoList: React.FC<VideoListProps> = ({ videosURL, onDelete }) => {
    const { t } = useTranslation("volunteer");
    const renderVideoList = (videos: string[]) => videos
        .map((videoURL: string, index) => (
            <div className={styles.videoWrapper}>
                <ReactPlayer
                    key={index}
                    width="387px"
                    height="auto"
                    url={videoURL}
                    controls
                />
                <CloseButton
                    className={styles.closeButton}
                    onClick={() => onDelete(videoURL)}
                />
            </div>
        ));

    return (
        <div className={styles.wrapper}>
            {videosURL.length ? (
                renderVideoList(videosURL)
            ) : (
                <div className={styles.listEmpty}>
                    <h4>{t("volunteer-gallery.Вы ещё не добавили ни одного видео")}</h4>
                </div>
            )}
        </div>
    );
};
