import { memo, useCallback } from "react";

import Input from "@/shared/ui/Input/Input";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import styles from "./VideoInput.module.scss";

export interface VideoInputProps {
    inputValue: string;
    onInputChange: (value: string) => void;
    addVideo: (newVideo: string) => void
}

export const VideoInput = memo(({
    inputValue, onInputChange, addVideo,
}: VideoInputProps) => {
    const handleInputChange = useCallback((value: string) => {
        onInputChange(value);
    }, [onInputChange]);

    const onSubmit = () => {
        // setVideos((prev:string[])=> [...prev, value]);
        addVideo(inputValue);
    };

    // const { handleSubmit } = useForm();

    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>Ссылка на видео</label>
            <div className={styles.contentWrapper}>
                <Input
                    id="input"
                    onChange={(e) => handleInputChange(e.target.value)}
                    value={inputValue}
                    placeholder="Ссылка на видео"
                />
                <AddButton onClick={onSubmit} className={styles.add}>
                    Добавить видео
                </AddButton>
            </div>
        </div>
    );
});
