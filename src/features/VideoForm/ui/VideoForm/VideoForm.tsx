import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { VideoList } from "@/widgets/VideoList/ui/VideoList";

import { useUpdateProfileVideoGalleryMutation } from "@/entities/Profile/api/profileApi";

import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { VideoFormImplementation } from "../../model/types/videoForm";
import { VideoInput } from "../VideoInput/VideoInput";
import styles from "./VideoForm.module.scss";

interface VideoFormProps {
    videoGallery?: string[];
}

export const VideoForm: FC<VideoFormProps> = (props) => {
    const { videoGallery } = props;

    const { t } = useTranslation("volunteer");
    const { control, handleSubmit, reset } = useForm<VideoFormImplementation>();
    const [videos, setVideos] = useState<string[]>([]);
    const [toast, setToast] = useState<ToastAlert>();

    const [updateProfileVideo, { isLoading }] = useUpdateProfileVideoGalleryMutation();

    const isCanAddVideo = videos.length < 10;

    useEffect(() => {
        if (videoGallery) {
            setVideos([...videoGallery]);
        }
    }, [videoGallery]);

    const addVideo = useCallback(
        async (newVideo: VideoFormImplementation) => {
            setToast(undefined);
            if (isCanAddVideo) {
                try {
                    await updateProfileVideo({
                        videoGallery: [...videos, newVideo.video],
                    });
                    setToast({
                        text: t("volunteer-gallery.Данные успешно изменены"),
                        type: HintType.Success,
                    });
                } catch (error) {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                } finally {
                    reset();
                }
            }
        },
        [isCanAddVideo, updateProfileVideo, videos, t, reset],
    );

    const deleteVideo = useCallback(
        async (videoIndex: number) => {
            setToast(undefined);
            const updatedVideos = videos.filter(
                (video, index) => index !== videoIndex,
            );

            try {
                await updateProfileVideo({
                    videoGallery: updatedVideos,
                });
                setVideos(updatedVideos);
                setToast({
                    text: t("volunteer-gallery.Данные успешно изменены"),
                    type: HintType.Success,
                });
            } catch (error) {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            }
        },
        [videos, updateProfileVideo, t],
    );

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <VideoInput
                control={control}
                addVideo={handleSubmit(addVideo)}
                isLoading={isLoading}
                disabled={!isCanAddVideo}
            />
            <VideoList videosURL={[...videos]} onDelete={deleteVideo} />
        </div>
    );
};
