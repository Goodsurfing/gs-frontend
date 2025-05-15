import {
    IconButton, Paper, SxProps, TextField, Theme,
} from "@mui/material";
import EmojiPicker, { Categories, EmojiClickData } from "emoji-picker-react";
import React, { FC, useRef, useState } from "react";
import { ReactSVG } from "react-svg";

import cn from "classnames";
import clipIcon from "@/shared/assets/icons/clip.svg";
import sendIcon from "@/shared/assets/icons/send-arrow.svg";
import smileIcon from "@/shared/assets/icons/chat-smile.svg";
import deleteIcon from "@/shared/assets/icons/delete.svg";

import styles from "./ChatInput.module.scss";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import uploadFile, { ObjectMediaResponse } from "@/shared/hooks/files/useUploadFile";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface AttachmentType {
    filename: string;
    objectMedia: ObjectMediaResponse;
}

export interface SendMessageType {
    text: string;
    attachments: string[];
}

interface ChatInputProps {
    sx?: SxProps<Theme>;
    disabled?: boolean;
    onSendMessage: (message: SendMessageType) => void;
    onError: (error: string) => void;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
    const {
        sx, disabled = false, onSendMessage, onError,
    } = props;
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [attachmentValue, setAttachmentValue] = useState<AttachmentType>();
    const [isAttachmentLoading, setAttachmentLoading] = useState<boolean>(false);

    const textFieldRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useOnClickOutside(emojiRef, () => setShowEmojiPicker(() => false));

    const onEmojiClick = (emoji: EmojiClickData) => {
        setInputValue((prev) => prev + emoji.emoji);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() || attachmentValue) {
            const formMessage: SendMessageType = {
                text: inputValue,
                attachments: attachmentValue?.objectMedia ? [attachmentValue.objectMedia["@id"]] : [],
            };
            onSendMessage(formMessage);
            setInputValue("");
            setAttachmentValue(undefined);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleAttachmentValue = async (file?: File) => {
        setAttachmentLoading(true);
        if (file) {
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                onError("Файл слишком большой. Максимальный размер: 2MB");
                setAttachmentLoading(false);
                return;
            }
            await uploadFile(file.name, file)
                .then((objectMedia) => {
                    if (objectMedia) {
                        setAttachmentValue({ filename: file.name, objectMedia });
                    }
                })
                .catch(() => {
                    onError("Произошла ошибка");
                })
                .finally(() => {
                    setAttachmentLoading(false);
                    if (textFieldRef.current) {
                        textFieldRef.current.focus();
                    }
                });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            handleAttachmentValue(event.target.files[0]);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleDeleteAttachment = () => {
        setAttachmentValue(undefined);
    };

    return (
        <div className={styles.wrapper}>
            <Paper
                component="form"
                onClick={(event) => {
                    event.stopPropagation();
                }}
                sx={{
                    p: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    minWidth: 150,
                    width: "100%",
                    boxShadow: "none",
                    border: "1px solid var(--text-caption)",
                    borderRadius: "10px",
                    ...sx,
                }}
            >
                {isAttachmentLoading ? <MiniLoader />
                    : (
                        <IconButton aria-label="menu" className={styles.button} onClick={handleFileClick}>
                            <ReactSVG
                                src={clipIcon}
                                className={styles.icon}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </IconButton>
                    )}
                <TextField
                    className="chatInput"
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Написать сообщение"
                    value={inputValue}
                    multiline
                    maxRows={10}
                    onChange={(e) => setInputValue(e.target.value)}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    onKeyDown={handleKeyDown}
                    inputRef={textFieldRef}
                />
                <IconButton
                    ref={emojiRef}
                    aria-label="menu"
                    className={styles.button}
                    onClick={() => {
                        setShowEmojiPicker((prev) => !prev);
                    }}
                >
                    <ReactSVG src={smileIcon} className={styles.icon} />
                    {showEmojiPicker && (
                        <div
                            className={styles.emojiWrapper}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                lazyLoadEmojis
                                categories={[
                                    { category: Categories.SMILEYS_PEOPLE, name: "Смайлы" },
                                    { category: Categories.ANIMALS_NATURE, name: "Животные" },
                                    { category: Categories.FOOD_DRINK, name: "Еда" },
                                ]}
                            />
                        </div>
                    )}
                </IconButton>
            </Paper>
            <IconButton
                aria-label="menu"
                className={styles.send}
                onClick={handleSendMessage}
                disabled={disabled}
            >
                <ReactSVG
                    src={sendIcon}
                    className={cn(
                        styles.icon,
                        styles.iconSend,
                        { [styles.disabled]: !(inputValue || attachmentValue) || disabled },
                    )}
                />
            </IconButton>
            {attachmentValue && (
                <div className={styles.attachmentFile}>
                    {attachmentValue.filename}
                    <IconButton onClick={handleDeleteAttachment}>
                        <ReactSVG
                            src={deleteIcon}
                            className={cn(styles.icon, styles.deleteIcon)}
                        />
                    </IconButton>
                </div>
            )}
        </div>
    );
};
