import React, { ChangeEventHandler, FC } from "react";
import cn from "classnames";
import styles from "./CommentInput.module.scss";
import Textarea from "@/shared/ui/Textarea/Textarea";
import Button from "@/shared/ui/Button/Button";

interface CommentInputProps {
    value: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    onSend: () => void;
    className?: string;
    btnText?: string;
    placeholder?: string;
    disabled?: boolean;
    disabledBtn?: boolean;
}

export const CommentInput: FC<CommentInputProps> = (props: CommentInputProps) => {
    const {
        value, onChange, className, btnText = "Написать комментарий", placeholder,
        disabled, onSend, disabledBtn,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <Textarea
                className={styles.input}
                label=""
                value={value}
                onChange={onChange}
                placeholder={placeholder || ""}
                disabled={disabled}
            />
            <Button
                onClick={() => onSend()}
                className={styles.button}
                variant="OUTLINE"
                size="MEDIUM"
                color="BLUE"
                disabled={disabledBtn}
            >
                {btnText}
            </Button>
        </div>
    );
};
