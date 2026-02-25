import React, { FC } from "react";
import cn from "classnames";
import VideoPlayer from "@/shared/ui/VideoPlayer/VideoPlayer";
import styles from "./VideoContent.module.scss";

interface VideoContentProps {
    url: string;
    className?: string;
}

export const VideoContent: FC<VideoContentProps> = (props) => {
    const { url, className } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <VideoPlayer
                width="750px"
                height="424px"
                url={url}
                controls
                playing={false}
            />
        </div>
    );
};
