import { memo } from "react";

import {
    Control, Controller,
} from "react-hook-form";
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
}: VideoInputProps) => (
    <div className={styles.wrapper}>
        <label htmlFor="input" className={styles.text}>Ссылка на видео</label>
        <Controller
            name="video"
            control={control}
            rules={{ pattern: { value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i, message: "Введите корректный URL" } }}
            render={({ field, fieldState }) => (
                <div className={styles.contentWrapper}>
                    <div className={styles.inputContent}>
                        <Input
                            id="input"
                            type="url"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Ссылка на видео"
                        />
                        {fieldState.error && (
                            <p className={styles.inputError}>{fieldState.error.message}</p>
                        )}
                    </div>
                    <AddButton disabled={fieldState.invalid} type="submit" onClick={addVideo} className={styles.add}>
                        Добавить видео
                    </AddButton>
                </div>
            )}
        />

    </div>
));
