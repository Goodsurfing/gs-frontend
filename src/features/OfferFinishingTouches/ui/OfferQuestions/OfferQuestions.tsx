import React, { FC } from "react";
import styles from "./OfferQuestions.module.scss";
import Input from "@/shared/ui/Input/Input";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";

interface OfferQuestionsProps {
    value: string[];
    onChange: (value: string[]) => void
}

export const OfferQuestions: FC<OfferQuestionsProps> = (props) => {
    const { value, onChange } = props;

    const handleInputChange = (index: number, newValue: string) => {
        const updatedValues = [...value];
        updatedValues[index] = newValue;
        onChange(updatedValues);
    };

    const handleAddQuestion = () => {
        if ((value[value.length - 1] === "") || (value.length >= 10)) return;
        onChange([...value, ""]);
    };

    const handleRemoveQuestion = (index: number) => {
        const updatedValues = value.filter((_, i) => i !== index);
        onChange(updatedValues);
    };

    return (
        <div className={styles.wrapper}>
            {value.map((question, index) => (
                <div key={index} className={styles.questionContainer}>
                    <Input
                        style={{ height: 44 }}
                        value={question}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                    <CloseButton
                        className={styles.closeBtn}
                        onClick={() => handleRemoveQuestion(index)}
                    />
                </div>
            ))}
            <AddButton
                text="Добавить вопрос"
                onClick={handleAddQuestion}
            />
        </div>
    );
};
