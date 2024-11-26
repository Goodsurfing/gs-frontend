import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import { useTranslation } from "react-i18next";
import { VideoListProps } from "@/widgets/VideoList";

import styles from "./VideoList.module.scss";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

export const VideoList: React.FC<VideoListProps> = ({ videosURL, onDelete }) => {
    const { t } = useTranslation("volunteer");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [remainingVideos, setRemainingVideos] = useState<number>(videosURL.length);

    useEffect(() => {
        if (remainingVideos === 0) {
            setLoading(false);
        }
    }, [remainingVideos]);

    const renderVideoList = (videos: string[]) => videos
        .map((videoURL: string, index) => (
            <div className={styles.videoWrapper} key={index}>
                <ReactPlayer
                    width="auto"
                    height="180px"
                    url={videoURL}
                    controls
                    onReady={() => setRemainingVideos((prev) => prev - 1)}
                />
                <CloseButton
                    className={styles.closeButton}
                    onClick={() => onDelete(videoURL)}
                />
            </div>
        ));

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

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
