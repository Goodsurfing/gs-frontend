import { memo, useCallback } from "react";

import Input from "@/shared/ui/Input/Input";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import styles from "./TeamInput.module.scss";

export interface TeamInputProps {
    inputValue: string;
    onInputChange: (value: string) => void;
}

export const TeamInput = memo(({ inputValue, onInputChange }: TeamInputProps) => {
    const handleInputChange = useCallback((value: string) => {
        onInputChange(value);
    }, [onInputChange]);

    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>Введите e-mail участника</label>
            <div className={styles.contentWrapper}>
                <Input
                    id="input"
                    onChange={(e) => handleInputChange(e.target.value)}
                    value={inputValue}
                />
                <AddButton disabled={!inputValue} text="Добавить участника" />
            </div>
        </div>
    );
});
