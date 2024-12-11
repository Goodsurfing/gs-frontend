import React, { FC, memo } from "react";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import styles from "./Message.module.scss";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import errorIcon from "@/shared/assets/icons/error.svg";

interface MessageProps {
    isUser?: boolean;
    text?: string;
    image?: string;
    date: string;
    avatar: string;
    username: string;
    isError?: boolean;
    onImageClick?: (src: string) => void;
}

export const Message: FC<MessageProps> = memo((props: MessageProps) => {
    const {
        avatar, date, isUser, text, image, username, isError = false, onImageClick,
    } = props;

    const messageClass = cn(styles.message, {
        [styles.userMessage]: isUser,
        [styles.otherMessage]: !isUser,
    });

    if (image) {
        return (
            <div className={messageClass}>
                <Avatar icon={avatar} className={styles.avatar} size="SMALL" />
                <div className={cn(
                    styles.messageContent,
                    styles.image,
                    { [styles.userMessage]: isUser },
                )}
                >
                    {isUser && <span className={styles.name}>{username}</span>}
                    <img className={styles.image} src={image} alt="" onClick={() => onImageClick?.(image)} />
                    <span className={styles.date}>
                        {date}
                        {isError && <ReactSVG src={errorIcon} className={styles.error} />}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={messageClass}>
            <Avatar icon={avatar} className={styles.avatar} size="SMALL" />
            <div className={cn(styles.messageContent, { [styles.userMessage]: isUser })}>
                {isUser && <span className={styles.name}>{username}</span>}
                <p className={styles.text}>{text}</p>
                <span className={styles.date}>
                    {date}
                    {isError && <ReactSVG src={errorIcon} className={styles.error} />}
                </span>
            </div>
        </div>
    );
});
