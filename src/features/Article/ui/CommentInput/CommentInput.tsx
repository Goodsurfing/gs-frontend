import React, { ChangeEventHandler, FC } from "react";
import cn from "classnames";
import styles from "./CommentInput.module.scss";
import Textarea from "@/shared/ui/Textarea/Textarea";
import Button from "@/shared/ui/Button/Button";

interface CommentInputProps {
    value: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    className?: string;
    btnText?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const CommentInput: FC<CommentInputProps> = (props: CommentInputProps) => {
    const {
        value, onChange, className, btnText = "Написать комментарий", placeholder,
        disabled,
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
                className={styles.button}
                variant="OUTLINE"
                size="MEDIUM"
                color="BLUE"
                disabled={disabled}
            >
                {btnText}
            </Button>
        </div>
    );
};
