import React, { FC } from "react";
import ReactPlayer from "react-player";
import cn from "classnames";
import styles from "./VideoContent.module.scss";

interface VideoContentProps {
    url: string;
    className?: string;
}

export const VideoContent: FC<VideoContentProps> = (props) => {
    const { url, className } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <ReactPlayer
                width="750px"
                height="424px"
                url={url}
                playing={false}
            />
        </div>
    );
};
