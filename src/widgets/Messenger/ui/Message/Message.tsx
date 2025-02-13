import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { ReactSVG } from "react-svg";
import { MediaObjectType } from "@/types/media";
import { useLazyGetMediaObjectByIdQuery } from "@/modules/Gallery";

import errorIcon from "@/shared/assets/icons/error.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import fileIcon from "@/shared/assets/icons/skills/administration.svg";

import styles from "./Message.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface MessageProps {
    isUser?: boolean;
    text?: string;
    attachments: string[] | MediaObjectType[];
    date: string;
    avatar: string;
    username: string;
    isError?: boolean;
    onImageClick?: (src: string) => void;
}

export const Message: FC<MessageProps> = memo((props: MessageProps) => {
    const {
        avatar,
        date,
        isUser,
        text,
        attachments,
        username,
        isError = false,
        onImageClick,
    } = props;

    const messageClass = cn(styles.message, {
        [styles.userMessage]: isUser,
        [styles.otherMessage]: !isUser,
    });

    const [image, setImage] = useState<MediaObjectType >();
    const [file, setFile] = useState<MediaObjectType >();

    const [getMediaObject, { data }] = useLazyGetMediaObjectByIdQuery();

    useEffect(() => {
        if (attachments.length > 0) {
            let mediaObjectUrl: string | undefined;
            const firstItem = attachments[0];

            if (typeof firstItem === "string") {
                mediaObjectUrl = firstItem.split("/").pop();
            } else if ("contentUrl" in firstItem) {
                mediaObjectUrl = firstItem.id;
            }
            if (mediaObjectUrl) {
                getMediaObject(mediaObjectUrl);
            }
        }
    }, [attachments, getMediaObject]);

    useEffect(() => {
        if (data) {
            const fileName = data.contentUrl.split("/").pop();
            if (!fileName) return;
            let fileExtension = fileName.split(".").pop();
            if (!fileExtension) return;
            fileExtension = fileExtension.toLowerCase();

            const imageExtensions = ["jpg", "jpeg", "png"];

            if (imageExtensions.includes(fileExtension)) {
                setImage(data);
            } else {
                setFile(data);
            }
        }
    }, [data]);

    if (file) {
        return (
            <div className={messageClass}>
                <Avatar icon={avatar} className={styles.avatar} size="SMALL" />
                <div className={cn(
                    styles.messageContent,
                    { [styles.userMessage]: isUser },
                )}
                >
                    {isUser && <span className={styles.name}>{username}</span>}
                    <a href={getMediaContent(file)} download className={styles.fileContainer}>
                        <div className={styles.fileWrapper}>
                            <ReactSVG src={fileIcon} />
                        </div>
                        <span>{file.contentUrl.split("/").pop()}</span>
                    </a>
                    <p className={styles.text}>{text}</p>
                    <span className={styles.date}>
                        {date}
                        {isError && <ReactSVG src={errorIcon} className={styles.error} />}
                    </span>
                </div>
            </div>
        );
    }

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
                    <img
                        className={styles.image}
                        src={getMediaContent(image)}
                        alt=""
                        onClick={() => onImageClick?.(getMediaContent(image) ?? "")}
                    />
                    <p className={styles.text}>{text}</p>
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
            <div
                className={cn(styles.messageContent, {
                    [styles.userMessage]: isUser,
                })}
            >
                {isUser && <span className={styles.name}>{username}</span>}
                <p className={styles.text}>{text}</p>
                <span className={styles.date}>
                    {date}
                    {isError && (
                        <ReactSVG src={errorIcon} className={styles.error} />
                    )}
                </span>
            </div>
        </div>
    );
});
