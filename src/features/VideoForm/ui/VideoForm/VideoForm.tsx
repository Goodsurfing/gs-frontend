import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";

import { VideoList } from "@/widgets/VideoList/ui/VideoList";

import Button from "@/shared/ui/Button/Button";

import { VideoFormImplementation } from "../../model/types/videoForm";
import { Text } from "../Text/Text";
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
            <Text />
            <VideoInput control={control} addVideo={handleSubmit(addVideo)} />
            <VideoList videosURL={videos} />
            <Button
                className={styles.btn}
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                Сохранить
            </Button>
        </div>
    );
};
