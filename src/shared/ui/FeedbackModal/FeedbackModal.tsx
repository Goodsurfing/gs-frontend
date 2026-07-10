import cn from "classnames";
import React, { FC, useState } from "react";

import { useCreateFeedbackMutation } from "@/entities/Feedback";

import Button from "../Button/Button";
import { Modal } from "../Modal/Modal";
import Input from "../Input/Input";
import Textarea from "../Textarea/Textarea";
import { ErrorText } from "../ErrorText/ErrorText";
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

    if (isSent) {
        return (
            <Modal onClose={handleClose} isShowCloseIcon>
                <div className={cn(styles.wrapper, { [styles.active]: isOpen })}>
                    <h2>Спасибо! Ваше сообщение отправлено.</h2>
                    <p className={styles.description}>Мы ответим вам на указанный email.</p>
                    <Button onClick={handleClose} variant="FILL" size="MEDIUM" color="BLUE">
                        Закрыть
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            onClose={handleClose}
            isShowCloseIcon
            className={cn(styles.modalWrapper, { [styles.active]: isOpen })}
        >
            <div className={cn(styles.wrapper, { [styles.active]: isOpen })}>
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
            </div>
        </Modal>
    );
};
