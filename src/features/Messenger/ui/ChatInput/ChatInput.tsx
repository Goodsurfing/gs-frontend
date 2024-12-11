import {
    IconButton, Paper, SxProps, TextField, Theme,
} from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React, { FC, useRef, useState } from "react";
import { ReactSVG } from "react-svg";

import cn from "classnames";
import clipIcon from "@/shared/assets/icons/clip.svg";
import sendIcon from "@/shared/assets/icons/send-arrow.svg";
import smileIcon from "@/shared/assets/icons/chat-smile.svg";

import styles from "./ChatInput.module.scss";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

interface ChatInputProps {
    sx?: SxProps<Theme>;
    disabled?: boolean;
    onSendMessage: (message: string) => void;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
    const { sx, disabled = false, onSendMessage } = props;
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const emojiRef = useRef(null);

    useOnClickOutside(emojiRef, () => setShowEmojiPicker(() => false));

    const onEmojiClick = (emoji: EmojiClickData) => {
        setInputValue((prev) => prev + emoji.emoji);
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue("");
        }
    };

    // const handleKeyDown = (e: React.KeyboardEvent) => {
    //     if (e.key === "Enter" && !e.shiftKey) {
    //         e.preventDefault();
    //         handleSendMessage();
    //     }
    // };

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
                <IconButton aria-label="menu" className={styles.button}>
                    <ReactSVG src={clipIcon} className={styles.icon} />
                </IconButton>
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
                    // onKeyDown={handleKeyDown}
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
                        { [styles.disabled]: !inputValue || disabled },
                    )}
                />
            </IconButton>
        </div>
    );
};
