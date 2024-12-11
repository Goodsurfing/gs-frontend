import React, { FC } from "react";
import cn from "classnames";
import { ChatInput } from "@/features/Messenger";
import { useCreateMessageMutation } from "@/entities/Chat/api/chatApi";

interface SendMessageProps {
    className?: string;
    disabled?: boolean;
    chatId: string;
}

export const SendMessage: FC<SendMessageProps> = (props) => {
    const { className, disabled, chatId } = props;
    const [createMessage] = useCreateMessageMutation();

    const handleSendMessage = async (message: string) => {
        const formData = new FormData();
        formData.append("text", message);
        formData.append("chat", `/api/v1/chats/${chatId}`);
        await createMessage(formData);
    };

    return (
        <div className={cn(className)}>
            <ChatInput disabled={disabled} onSendMessage={handleSendMessage} />
        </div>
    );
};
