import React, { ChangeEventHandler, FC } from "react";
import cn from "classnames";
import styles from "./CommentInput.module.scss";
import Textarea from "@/shared/ui/Textarea/Textarea";
import Button from "@/shared/ui/Button/Button";

interface CommentInputProps {
    value: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    className?: string;
}

export const CommentInput: FC<CommentInputProps> = (props: CommentInputProps) => {
    const { value, onChange, className } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <Textarea className={styles.input} label="" value={value} onChange={onChange} />
            <Button className={styles.button} variant="OUTLINE" size="MEDIUM" color="BLUE">Написать комментарий</Button>
        </div>
    );
};
