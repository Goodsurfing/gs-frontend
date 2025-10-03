import { memo } from "react";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddButton } from "@/shared/ui/AddButton/AddButton";
import Input from "@/shared/ui/Input/Input";

import { VideoFormImplementation } from "../../model/types/videoForm";
import styles from "./VideoInput.module.scss";

export interface VideoInputProps {
    control: Control<VideoFormImplementation>;
    addVideo: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const VideoInput = memo(({
    control, addVideo, isLoading,
    disabled = false,
}: VideoInputProps) => {
    const { t } = useTranslation("volunteer");

    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>
                {t("volunteer-gallery.Ссылка на видео")}
            </label>
            <Controller
                name="video"
                control={control}
                rules={{
                    pattern: {
                        value: /^(?:(?:https?:\/\/)?(?:www\.)?(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch?.+&v=))((\w|-){11})(?:\S+)?|(?:https?:\/\/)?(?:www\.)?(?:vimeo.com\/)(\d+)|(?:https?:\/\/)?(?:www\.)?(?:vk\.com\/(?:video|videos)-?\d+_\d+|vkvideo\.ru\/(?:video-?\d+_\d+|video_ext\.php\?(?:[^&]*&)?(?:oid|id)=-?\d+_\d+))|(?:https?:\/\/)?(?:www\.)?(?:rutube.ru\/video\/)([a-f0-9]{32})(?:\/\S*)?)$/,
                        message: t("volunteer-gallery.Введите корректный URL"),
                    },
                }}
                render={({ field, fieldState }) => (
                    <div className={styles.contentWrapper}>
                        <div className={styles.inputContent}>
                            <Input
                                id="input"
                                type="url"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t(
                                    "volunteer-gallery.Ссылка на видео",
                                )}
                            />
                            {fieldState.error && (
                                <p className={styles.inputError}>
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                        <AddButton
                            disabled={fieldState.invalid || isLoading || !field.value || disabled}
                            type="submit"
                            text={t("volunteer-gallery.Добавить видео")}
                            onClick={addVideo}
                            className={styles.add}
                        />
                    </div>
                )}
            />
        </div>
    );
});
