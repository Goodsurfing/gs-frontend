import cn from "classnames";
import React, { FC, useState } from "react";
import { ReactSVG } from "react-svg";

import { UserSettings } from "@/features/Messenger";

import { MessageType, UserChatType, UserInfoCard } from "@/entities/Messenger";

import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import chatIcon from "@/shared/assets/icons/chat.svg";

import { Message } from "../Message/Message";
import styles from "./Chat.module.scss";

interface ChatProps {
    id: string;
    isEmpty: boolean;
    className?: string;
    user: UserChatType;
    messages: MessageType[];
}

export const Chat: FC<ChatProps> = (props) => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id,
        className,
        isEmpty,
        user,
    } = props;

    const [isInfoOpened, setInfoOpened] = useState<boolean>(true);

    if (isEmpty) {
        return (
            <div className={cn(styles.wrapper, styles.empty, className)}>
                <ReactSVG src={chatIcon} className={styles.chatIcon} />
                <span>Выберите, кому хотели бы написать</span>
            </div>
        );
    }

    const infoOpenedChange = () => {
        setInfoOpened((prev) => !prev);
    };

    const renderMessages = user.messages.map((message) => (
        <Message
            avatar={user.avatar}
            date={message.date}
            isUser={message.isUser}
            text={message.content}
            username={user.name}
        />
    ));

    return (
        <div className={cn(styles.wrapper, className)}>
            <div style={{ flexGrow: 1 }}>
                <div className={styles.topTab}>
                    <span className={styles.userName}>{user.name}</span>
                    <div className={styles.settingsInfo}>
                        <UserSettings />
                        <ReactSVG
                            src={arrowIcon}
                            className={styles.openInfo}
                            onClick={() => setInfoOpened((prev) => !prev)}
                        />
                    </div>
                </div>
                <div className={styles.chat}>
                    {renderMessages}
                </div>
            </div>
            {isInfoOpened && (
                <UserInfoCard user={user} infoOpenedChange={infoOpenedChange} />
            )}
        </div>
    );
};
