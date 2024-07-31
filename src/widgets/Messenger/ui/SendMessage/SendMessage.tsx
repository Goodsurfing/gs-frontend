import React, { FC } from "react";
import cn from "classnames";
import { ChatInput } from "@/features/Messenger";

interface SendMessageProps {
    className?: string;
    disabled?: boolean;
}

export const SendMessage: FC<SendMessageProps> = (props) => {
    const { className, disabled } = props;
    return (
        <div className={cn(className)}>
            <ChatInput disabled={disabled} />
        </div>
    );
};
