import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ErrorType } from "@/types/api/error";

import { VideoList } from "@/widgets/VideoList/ui/VideoList";

import { Host, useUpdateHostMutation } from "@/entities/Host";

import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { VideoFormImplementation } from "../../model/types/videoForm";
import { VideoInput } from "../VideoInput/VideoInput";
import styles from "./HostVideoForm.module.scss";

interface HostVideoFormProps {
    host: Host;
    videoGallery?: string[];
}

export const HostVideoForm: FC<HostVideoFormProps> = (props) => {
    const { host, videoGallery } = props;
    const { control, handleSubmit, reset } = useForm<VideoFormImplementation>();
    const [videos, setVideos] = useState<string[]>([]);
    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("host");

    const [updateHost, { isLoading }] = useUpdateHostMutation();

    useEffect(() => {
        if (videoGallery) {
            setVideos([...videoGallery]);
        }
    }, [videoGallery]);

    const addVideo = useCallback(
        (newVideo: VideoFormImplementation) => {
            setToast(undefined);
            updateHost({
                id: host.id,
                body: {
                    videoGallery: [...videos, newVideo.video],
                },
            })
                .unwrap()
                .then(() => {
                    setToast({
                        text: t("hostVideo.Данные успешно изменены"),
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                })
                .finally(() => {
                    reset();
                });
        },
        [updateHost, host.id, videos, t, reset],
    );

    const deleteVideo = useCallback(
        (videoIndex: number) => {
            setToast(undefined);
            const updatedVideos = videos.filter(
                (video, index) => index !== videoIndex,
            );

            updateHost({
                id: host.id,
                body: {
                    videoGallery: updatedVideos,
                },
            })
                .unwrap()
                .then(() => {
                    setVideos(updatedVideos);
                    setToast({
                        text: t("hostVideo.Данные успешно изменены"),
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        },
        [videos, updateHost, host.id, t],
    );

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
