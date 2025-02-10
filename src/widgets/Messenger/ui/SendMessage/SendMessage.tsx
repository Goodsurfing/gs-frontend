import React, { FC } from "react";
import cn from "classnames";
import { ChatInput, SendMessageType } from "@/features/Messenger";
import { CreateMessageType, useCreateMessageMutation } from "@/entities/Chat/api/chatApi";

interface SendMessageProps {
    className?: string;
    disabled?: boolean;
    chatId: string;
}

export const SendMessage: FC<SendMessageProps> = (props) => {
    const { className, disabled, chatId } = props;
    const [createMessage] = useCreateMessageMutation();

    const handleSendMessage = async (message: SendMessageType) => {
        const { text, attachments } = message;
        const formData: CreateMessageType = {
            chat: `/api/v1/chats/${chatId}`,
            text,
            attachments,
        };
        await createMessage(formData);
    };

    return (
        <div className={cn(className)}>
            <ChatInput disabled={disabled} onSendMessage={handleSendMessage} />
        </div>
    );
};
