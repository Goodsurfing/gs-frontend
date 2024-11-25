import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useForm } from "react-hook-form";
import { ErrorType } from "@/types/api/error";

import { VideoList } from "@/widgets/VideoList/ui/VideoList";

import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";

import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { VideoFormImplementation } from "../../model/types/videoForm";
import { VideoInput } from "../VideoInput/VideoInput";
import styles from "./VideoForm.module.scss";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";

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

    useEffect(() => {
        if (videoGallery) {
            setVideos([...videoGallery]);
        }
    }, [videoGallery]);

    const addVideo = useCallback(
        (newVideo: VideoFormImplementation) => {
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
                }).finally(() => {
                    reset();
                });
        },
        [updateProfile, profileId, videos, refetchVolunteer, reset],
    );

    const deleteVideo = useCallback((videoUrl: string) => {
        const updatedVideos = videos.filter((video) => video !== videoUrl);

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
    }, [videos, updateProfile, profileId]);

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
