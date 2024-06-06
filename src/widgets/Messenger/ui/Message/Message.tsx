import React, { FC, memo } from "react";
import cn from "classnames";
import styles from "./Message.module.scss";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

interface MessageProps {
    isUser?: boolean;
    text: string;
    date: Date;
    avatar: string;
    username: string;
}

export const Message: FC<MessageProps> = memo((props: MessageProps) => {
    const {
        avatar, date, isUser, text, username,
    } = props;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;
    const messageClass = cn(styles.message, {
        [styles.userMessage]: isUser,
        [styles.otherMessage]: !isUser,
    });

    return (
        <div className={messageClass}>
            <Avatar icon={avatar} className={styles.avatar} size="SMALL" />
            <div className={cn(styles.messageContent, { [styles.userMessage]: isUser })}>
                {isUser && <span className={styles.name}>{username}</span>}
                <p className={styles.text}>{text}</p>
                <span className={styles.date}>
                    {time}
                </span>
            </div>
        </div>
    );
});
