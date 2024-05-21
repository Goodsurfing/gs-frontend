import React, { FC } from "react";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import styles from "./Chat.module.scss";
import chatIcon from "@/shared/assets/icons/chat.svg";
import { Message, UserChatType } from "@/entities/Messenger";

interface ChatProps {
    id: string;
    isEmpty: boolean;
    className?: string;
    user: UserChatType;
    messages: Message[];
}

export const Chat: FC<ChatProps> = (props) => {
    const {
        id, className, isEmpty, messages, user: {
            name,
            description, address, skills,
            languages, cases,
            arrivalDate, expirationDate, avatar,
        },
    } = props;

    if (isEmpty) {
        return (
            <div className={cn(styles.wrapper, styles.empty, className)}>
                <ReactSVG src={chatIcon} className={styles.chatIcon} />
                <span>Выберите, кому хотели бы написать</span>
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.topTab}>
                <span className={styles.userName}>{name}</span>
            </div>
            Chat
            {id}
        </div>
    );
};
