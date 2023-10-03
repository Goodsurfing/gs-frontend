import React, { useState, useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import Button from "@/shared/ui/Button/Button";

import { Text } from "../Text/Text";
import { VideoInput } from "../VideoInput/VideoInput";

import styles from "./VideoForm.module.scss";
import { VideoList } from "@/widgets/VideoList/ui/VideoList";
import { VideoURL } from "../../model/types/videoForm";

export const VideoForm = () => {
    const { control, getValues } = useForm({ mode: "onSubmit" });
    const [videos, setVideos] = useState<string[]>([]);

    // const submit = (data) => {
    //     setVideos(data);
    // };

    const addVideo = (newVideo: string) => {
        setVideos((prev) => [...prev, newVideo]);
    };

    useEffect(() => {
        console.log(videos);
    }, [videos]);

    return (
        <div className={styles.wrapper}>
            <Text />
            <Controller
                control={control}
                name="video"
                render={({ field }) =>
                    // console.log(field.value);
                    (
                        <VideoInput inputValue={field.value} onInputChange={field.onChange} addVideo={addVideo} />
                    )}
            />
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
