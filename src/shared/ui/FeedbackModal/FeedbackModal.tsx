import React, { FC, useState } from "react";
import { createPortal } from "react-dom";
import { CircularProgress } from "@mui/material";
import cn from "classnames";

import { useCreateFeedbackMutation } from "@/entities/Feedback";

import Button from "../Button/Button";
import Input from "../Input/Input";
import Textarea from "../Textarea/Textarea";
import { ErrorText } from "../ErrorText/ErrorText";
import IconComponent from "../IconComponent/IconComponent";
import closeIcon from "@/shared/assets/icons/delete.svg";
import styles from "./FeedbackModal.module.scss";
import buttonStyles from "../Button/Button.module.scss";

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackModal: FC<FeedbackModalProps> = (props) => {
    const { isOpen, onClose } = props;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [errorText, setErrorText] = useState<string | undefined>();

    const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

    const isValid = name.trim() !== ""
        && EMAIL_REGEXP.test(email.trim())
        && message.trim() !== "";

    const handleClose = () => {
        onClose();
        setName("");
        setEmail("");
        setMessage("");
        setIsSent(false);
        setErrorText(undefined);
    };

    const handleSubmit = async () => {
        if (!isValid) return;
        setErrorText(undefined);

        try {
            await createFeedback({ name, email, message }).unwrap();
            setIsSent(true);
        } catch {
            setErrorText("Не удалось отправить сообщение. Попробуйте ещё раз.");
        }
    };

    if (!isOpen) return null;

    return createPortal(
        // "modal" class matches the selector in _default.scss that defines
        // theme CSS variables (--accent-color etc.) — without it, anything
        // portaled straight to <body> renders colourless (buttons, borders).
        <div className="modal">
            <div className={styles.backdrop} onClick={handleClose} />
            <div className={styles.panel}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Закрыть"
                >
                    <IconComponent icon={closeIcon} alt="close" className={styles.closeIcon} />
                </button>
                {isSent ? (
                    <>
                        <h2>Спасибо! Ваше сообщение отправлено.</h2>
                        <p className={styles.description}>Мы ответим вам на указанный email.</p>
                        <Button onClick={handleClose} variant="FILL" size="MEDIUM" color="BLUE">
                            Закрыть
                        </Button>
                    </>
                ) : (
                    <>
                        <h2>Напишите нам</h2>
                        <Input
                            id="feedback-name"
                            label="Ваше имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={255}
                        />
                        <Input
                            id="feedback-email"
                            label="E-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={255}
                        />
                        <Textarea
                            id="feedback-message"
                            label="Сообщение"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={2000}
                        />
                        {errorText && (<ErrorText text={errorText} />)}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!isValid || isLoading}
                            className={cn(
                                buttonStyles.btn,
                                buttonStyles.FILL,
                                buttonStyles.BLUE,
                                buttonStyles.MEDIUM,
                                styles.submitButton,
                            )}
                        >
                            {isLoading ? (
                                <CircularProgress size={20} sx={{ color: "#fff" }} />
                            ) : (
                                <span className={buttonStyles.text}>Отправить</span>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>,
        document.body,
    );
};
