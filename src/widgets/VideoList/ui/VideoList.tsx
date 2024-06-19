import React from "react";
import ReactPlayer from "react-player";

import { useTranslation } from "react-i18next";
import { VideoListProps } from "@/widgets/VideoList";

import styles from "./VideoList.module.scss";

export const VideoList: React.FC<VideoListProps> = ({ videosURL }) => {
    const { t } = useTranslation("volunteer");
    const renderVideoList = (videos: string[]) => videos
        .map((videoURL: string, index) => (
            <ReactPlayer
                key={index}
                width="387px"
                height="220px"
                url={videoURL}
                controls
            />
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
