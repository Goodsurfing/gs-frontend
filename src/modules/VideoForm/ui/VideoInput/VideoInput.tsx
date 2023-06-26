import React, { memo, useCallback } from "react";

import styles from "./VideoInput.module.scss";
import Input from "@/shared/ui/Input/Input";
import AddButton from "@/shared/ui/AddButton/AddButton";

export interface VideoInputProps {
    inputValue: string;
    onInputChange: (value: string) => void;
}

export const VideoInput = memo(({ inputValue, onInputChange }: VideoInputProps) => {
    const handleInputChange = useCallback((value: string) => {
        onInputChange(value);
    }, [onInputChange]);

    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>Ссылка на видео</label>
            <div className={styles.contentWrapper}>
                <Input
                    id="input"
                    onChange={(e) => {
                        return handleInputChange(e.target.value);
                    }}
                    value={inputValue}
                    placeholder="Ссылка на видео"
                />
                <AddButton className={styles.add}>
                    Добавить видео
                </AddButton>
            </div>
        </div>
    );
});
