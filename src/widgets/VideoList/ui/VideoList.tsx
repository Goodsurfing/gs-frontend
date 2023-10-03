import React from "react";
import ReactPlayer from "react-player";

import styles from "./VideoList.module.scss";
import { VideoListProps } from "../model/videoList";

export const VideoList:React.FC<VideoListProps> = ({ videosURL }) => {
    const renderVideoList = (videosURL:string[]) => videosURL.map((videoURL:string) => <ReactPlayer width="400px" url={videoURL} />);

    return (
        <div className={styles.wrapper}>
            {renderVideoList(videosURL)}
        </div>
    );
};
