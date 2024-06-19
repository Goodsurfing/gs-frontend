import cn from "classnames";
import React, { FC, useState } from "react";
import { ReactSVG } from "react-svg";

import { OfferApplication, UserSettings } from "@/features/Messenger";

import { MessageType, UserChatType, UserInfoCard } from "@/entities/Messenger";

import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import arrowBackIcon from "@/shared/assets/icons/arrow.svg";
import chatIcon from "@/shared/assets/icons/chat.svg";

import { Message } from "../Message/Message";
import styles from "./Chat.module.scss";
import { SendMessage } from "../SendMessage/SendMessage";

interface ChatProps {
    id: string | null;
    onChange: (value: string | null) => void
    className?: string;
    user: UserChatType;
    messages: MessageType[];
}

export const Chat: FC<ChatProps> = (props) => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id,
        className,
        onChange,
        user,
    } = props;

    const [isInfoOpened, setInfoOpened] = useState<boolean>(false);

    if (!id) {
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

    const handleBackButton = () => {
        onChange(null);
    };

    const renderMessages = () => {
        let currentDate = "";

        return user.messages.map((message) => {
            const messageDate = new Date(message.date).toLocaleDateString();

            let dateLine = null;
            if (messageDate !== currentDate) {
                currentDate = messageDate;
                dateLine = <div className={styles.date}>{currentDate}</div>;
            }

            return (
                <>
                    {dateLine}
                    <Message
                        avatar={user.avatar}
                        date={message.date}
                        isUser={message.isUser}
                        text={message.content}
                        username={user.name}
                    />
                </>
            );
        });
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className={styles.topTab}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <ReactSVG
                            src={arrowBackIcon}
                            className={styles.back}
                            onClick={handleBackButton}
                        />
                        <span className={styles.userName}>{user.name}</span>
                    </div>
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
                    <div className={styles.chatList}>
                        {renderMessages()}
                        <OfferApplication isHost={false} username="Николай Николаевич" />
                    </div>
                </div>
                <SendMessage />
            </div>
            <UserInfoCard
                user={user}
                infoOpenedChange={infoOpenedChange}
                className={cn(styles.userInfo, { [styles.open]: isInfoOpened })}
            />
        </div>
    );
};
