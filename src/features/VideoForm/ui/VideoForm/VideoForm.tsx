import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { VideoList } from "@/widgets/VideoList/ui/VideoList";

import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";

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
    profileId: string;
    videoGallery?: string[];
}

export const VideoForm: FC<VideoFormProps> = (props) => {
    const { profileId, videoGallery } = props;
    const { control, handleSubmit, reset } = useForm<VideoFormImplementation>();
    const [videos, setVideos] = useState<string[]>([]);
    const [toast, setToast] = useState<ToastAlert>();

    const [updateProfile, { isLoading }] = useUpdateProfileInfoMutation();
    const { refetch: refetchVolunteer } = useGetVolunteerByIdQuery(profileId);

    const isCanAddVideo = videos.length < 10;

    useEffect(() => {
        if (videoGallery) {
            setVideos([...videoGallery]);
        }
    }, [videoGallery]);

    const addVideo = useCallback(
        (newVideo: VideoFormImplementation) => {
            if (isCanAddVideo) {
                updateProfile({
                    userId: profileId,
                    profileData: {
                        videoGallery: [...videos, newVideo.video],
                    },
                })
                    .then(() => {
                        setToast({
                            text: "Данные успешно изменены",
                            type: HintType.Success,
                        });
                        refetchVolunteer();
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
            }
        },
        [isCanAddVideo, updateProfile, profileId, videos, refetchVolunteer, reset],
    );

    const deleteVideo = useCallback(
        (videoIndex: number) => {
            setToast(undefined);
            const updatedVideos = videos.filter(
                (video, index) => index !== videoIndex,
            );

            updateProfile({
                userId: profileId,
                profileData: {
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
        },
        [videos, updateProfile, profileId],
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
