import React, { useState } from "react";

import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import Button from "@/shared/ui/Button/Button";

import { Text } from "../Text/Text";
import { VideoInput } from "../VideoInput/VideoInput";

import styles from "./VideoForm.module.scss";
import { VideoList } from "@/widgets/VideoList/ui/VideoList";
import { IForm } from "../../model/types/videoForm";

export const VideoForm = () => {
    const { control, handleSubmit, reset } = useForm<IForm>();
    const [videos, setVideos] = useState<string[]>([]);

    const addVideo = (newVideo: IForm) => {
        // If ReactPlayer can`t play the video from url then do nothing
        if (!ReactPlayer.canPlay(newVideo.video)) return;

        setVideos((prev) => [...prev, newVideo.video]);
        reset();
    };

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
