import cn from "classnames";
import React, { FC, useMemo } from "react";

import { VideoCard, VideoCardType } from "@/entities/Video";
import styles from "./VideoList.module.scss";

interface VideoListProps {
    data?: VideoCardType[];
    className?: string;
}

export const VideoList: FC<VideoListProps> = (props) => {
    const { data, className } = props;
    const renderVideoList = useMemo(
        () => data?.map((video, key) => (
            <VideoCard video={video} key={key} className={styles.article} />
        )),
        [data],
    );

    if (!data) {
        return <div>Видео не было найдено</div>;
    }

    return (
        <div className={cn(className, styles.wrapper)}>{renderVideoList}</div>
    );
};
