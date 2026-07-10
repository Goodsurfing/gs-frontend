import React, { FC, useState } from "react";
import { createPortal } from "react-dom";

import { useCreateFeedbackMutation } from "@/entities/Feedback";

import Button from "../Button/Button";
import Input from "../Input/Input";
import Textarea from "../Textarea/Textarea";
import { ErrorText } from "../ErrorText/ErrorText";
import IconComponent from "../IconComponent/IconComponent";
import closeIcon from "@/shared/assets/icons/delete.svg";
import styles from "./FeedbackModal.module.scss";

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
        <>
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
                        <Button
                            onClick={handleSubmit}
                            variant="FILL"
                            size="MEDIUM"
                            color="BLUE"
                            disabled={!isValid || isLoading}
                        >
                            Отправить
                        </Button>
                    </>
                )}
            </div>
        </>,
        document.body,
    );
};
