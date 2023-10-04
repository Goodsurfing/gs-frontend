import React from "react";
import ReactPlayer from "react-player";

import styles from "./VideoList.module.scss";
import { VideoListProps } from "@/widgets/VideoList";

export const VideoList:React.FC<VideoListProps> = ({ videosURL }) => {
    const renderVideoList = (videos:string[]) => videos.map((videoURL:string) => <ReactPlayer width="400px" url={videoURL} />);

    return (
        <div className={styles.wrapper}>
            {videosURL.length ? renderVideoList(videosURL)
                : (
                    <div className={styles.listEmpty}>
                        <h4>Вы ещё не добавили ни одного видео</h4>
                    </div>
                )}
        </div>
    );
};
