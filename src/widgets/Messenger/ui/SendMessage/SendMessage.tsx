import React, { FC } from "react";
import cn from "classnames";
import { ChatInput } from "@/features/Messenger";

interface SendMessageProps {
    className?: string;
}

export const SendMessage: FC<SendMessageProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(className)}>
            <ChatInput />
        </div>
    );
};
