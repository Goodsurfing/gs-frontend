import { memo } from "react";

import {
    Control, Controller,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@/shared/ui/Input/Input";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import styles from "./VideoInput.module.scss";
import { VideoFormImplementation } from "../../model/types/videoForm";

export interface VideoInputProps {
    control: Control<VideoFormImplementation>;
    addVideo: () => void;
}

export const VideoInput = memo(({
    control, addVideo,
}: VideoInputProps) => {
    const { t } = useTranslation("volunteer");

    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>{t("volunteer-gallery.Ссылка на видео")}</label>
            <Controller
                name="video"
                control={control}
                rules={{ pattern: { value: /^(?:(?:https?:\/\/)?(?:www\.)?(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch?.+&v=))((\w|-){11})(?:\S+)?|(http:\/\/|https:\/\/)?(www\.)?(vimeo.com\/)([0-9]+))$/, message: t("volunteer-gallery.Введите корректный URL") } }}
                render={({ field, fieldState }) => (
                    <div className={styles.contentWrapper}>
                        <div className={styles.inputContent}>
                            <Input
                                id="input"
                                type="url"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t("volunteer-gallery.Ссылка на видео")}
                            />
                            {fieldState.error && (
                                <p className={styles.inputError}>{fieldState.error.message}</p>
                            )}
                        </div>
                        <AddButton disabled={fieldState.invalid} type="submit" text="Добавить видео" onClick={addVideo} className={styles.add} />
                    </div>
                )}
            />

        </div>
    );
});
