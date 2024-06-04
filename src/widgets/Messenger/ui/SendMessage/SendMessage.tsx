import React, { FC } from "react";
import cn from "classnames";
import styles from "./SendMessage.module.scss";
import { ChatInput } from "@/features/Messenger";

interface SendMessageProps {
    className?: string;
}

export const SendMessage: FC<SendMessageProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            <ChatInput />
        </div>
    );
};
