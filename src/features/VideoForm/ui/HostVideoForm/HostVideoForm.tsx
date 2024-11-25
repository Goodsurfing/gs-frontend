import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { VideoList } from "@/widgets/VideoList/ui/VideoList";

import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { VideoFormImplementation } from "../../model/types/videoForm";
import { VideoInput } from "../VideoInput/VideoInput";
import styles from "./HostVideoForm.module.scss";

import { Host, useUpdateHostMutation } from "@/entities/Host";

interface HostVideoFormProps {
    host: Host;
    videoGallery?: string[];
}

export const HostVideoForm: FC<HostVideoFormProps> = (props) => {
    const { host, videoGallery } = props;
    const { control, handleSubmit, reset } = useForm<VideoFormImplementation>();
    const [videos, setVideos] = useState<string[]>([]);
    const [toast, setToast] = useState<ToastAlert>();

    const [updateHost, { isLoading }] = useUpdateHostMutation();

    useEffect(() => {
        if (videoGallery) {
            setVideos([...videoGallery]);
        }
    }, [videoGallery]);

    const addVideo = useCallback(
        (newVideo: VideoFormImplementation) => {
            updateHost({
                id: host.id,
                body: {
                    videoGallery: [...videos, newVideo.video],
                },
            })
                .then(() => {
                    setToast({
                        text: "Данные успешно изменены",
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                }).finally(() => {
                    reset();
                });
        },
        [updateHost, host.id, videos, reset],
    );

    const deleteVideo = useCallback((videoUrl: string) => {
        const updatedVideos = videos.filter((video) => video !== videoUrl);

        updateHost({
            id: host.id,
            body: {
                videoGallery: updatedVideos,
            },
        })
            .then(() => {
                setVideos(updatedVideos);
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
    }, [videos, updateHost, host.id]);

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <VideoInput
                control={control}
                addVideo={handleSubmit(addVideo)}
                isLoading={isLoading}
            />
            <VideoList videosURL={[...videos]} onDelete={deleteVideo} />
        </div>
    );
};
