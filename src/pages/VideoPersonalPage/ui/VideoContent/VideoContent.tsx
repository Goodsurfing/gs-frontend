import React, { FC } from "react";
import cn from "classnames";
import styles from "./VideoContent.module.scss";
import VideoPlayer from "@/shared/ui/VideoPlayer/VideoPlayer";

interface VideoContentProps {
    url: string;
    className?: string;
}

export const VideoContent: FC<VideoContentProps> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { url, className } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <VideoPlayer
                width="750px"
                height="424px"
                url="https://vkvideo.ru/video-150368366_456239379"
                controls
                playing={false}
            />
        </div>
    );
};
