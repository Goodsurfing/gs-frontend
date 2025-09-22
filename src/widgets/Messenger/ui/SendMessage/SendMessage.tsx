import React, { FC } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChatInput, SendMessageType } from "@/features/Messenger";
import { useCreateMessageMutation } from "@/entities/Chat/api/chatApi";
import { BASE_URI } from "@/shared/constants/api";
import { getMessengerPageIdUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/entities/Locale";
import { CreateMessageType } from "@/entities/Chat/model/types/messages";

interface SendMessageProps {
    className?: string;
    disabled?: boolean;
    chatId: string;
    recipientVolunteer?: string;
    recipientOrganization?: string;
    onError: (error: string) => void;
    locale: Locale;
}

export const SendMessage: FC<SendMessageProps> = (props) => {
    const {
        className, disabled, chatId,
        recipientVolunteer, recipientOrganization, onError, locale,
    } = props;
    const [createMessage, { isLoading }] = useCreateMessageMutation();
    const { t } = useTranslation("messenger");
    const navigate = useNavigate();

    const handleSendMessage = async (message: SendMessageType) => {
        const { text, attachments } = message;
        if (chatId === "create" && (!!recipientVolunteer || !!recipientOrganization)) {
            const recipientVolunteerTemp = recipientVolunteer ? `${BASE_URI}users/${recipientVolunteer}` : undefined;
            const recipientOrganizationTemp = recipientOrganization ? `${BASE_URI}organizations/${recipientOrganization}` : undefined;
            const formData: CreateMessageType = {
                recipient: recipientVolunteerTemp,
                recipientOrganization: recipientOrganizationTemp,
                text,
                attachments,
            };
            await createMessage(formData).unwrap()
                .then((createMessageResponse) => {
                    navigate(getMessengerPageIdUrl(locale, createMessageResponse.chat.split("/").pop()));
                })
                .catch(() => {
                    onError(t("Произошла ошибка при отправке сообщения"));
                });
            return;
        }
        const formData: CreateMessageType = {
            chat: `${BASE_URI}chats/${chatId}`,
            text,
            attachments,
        };
        try {
            await createMessage(formData).unwrap();
        } catch {
            onError(t("Произошла ошибка при отправке сообщения"));
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
