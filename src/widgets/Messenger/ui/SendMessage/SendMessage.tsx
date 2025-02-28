import React, { FC } from "react";
import cn from "classnames";
import { ChatInput, SendMessageType } from "@/features/Messenger";
import { CreateMessageType, useCreateMessageMutation } from "@/entities/Chat/api/chatApi";

interface SendMessageProps {
    className?: string;
    disabled?: boolean;
    chatId: string;
    onError: (error: string) => void;
}

export const SendMessage: FC<SendMessageProps> = (props) => {
    const {
        className, disabled, chatId, onError,
    } = props;
    const [createMessage, { isLoading }] = useCreateMessageMutation();

    const handleSendMessage = async (message: SendMessageType) => {
        const { text, attachments } = message;
        const formData: CreateMessageType = {
            chat: `/api/v1/chats/${chatId}`,
            text,
            attachments,
        };
        try {
            await createMessage(formData).unwrap();
        } catch {
            onError("Произошла ошибка при отправке сообщения");
        }
    };

    return (
        <div className={cn(className)}>
            <ChatInput
                disabled={disabled || isLoading}
                onSendMessage={handleSendMessage}
                onError={onError}
            />
        </div>
    );
};
