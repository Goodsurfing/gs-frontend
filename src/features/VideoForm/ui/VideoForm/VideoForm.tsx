import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";

import { VideoList } from "@/widgets/VideoList/ui/VideoList";

import { VideoFormImplementation } from "../../model/types/videoForm";
import { VideoInput } from "../VideoInput/VideoInput";
import styles from "./VideoForm.module.scss";

export const VideoForm = () => {
    const { control, handleSubmit, reset } = useForm<VideoFormImplementation>();
    const [videos, setVideos] = useState<string[]>([]);

    const addVideo = useCallback(
        (newVideo: VideoFormImplementation) => {
            // If ReactPlayer can`t play the video from url then do nothing
            if (!ReactPlayer.canPlay(newVideo.video)) return;

            setVideos((prev) => [...prev, newVideo.video]);
            reset();
        },
        [setVideos, reset],
    );

    return (
        <div className={styles.wrapper}>
            <VideoInput control={control} addVideo={handleSubmit(addVideo)} />
            <VideoList videosURL={videos} />
        </div>
    );
};
