import React, { FC, useState } from "react";
import { CircularProgress } from "@mui/material";
import cn from "classnames";
import { useTranslation } from "react-i18next";

import { useCreateFeedbackMutation } from "@/entities/Feedback";

import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import Textarea from "@/shared/ui/Textarea/Textarea";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import styles from "./FeedbackForm.module.scss";
import buttonStyles from "@/shared/ui/Button/Button.module.scss";

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FeedbackFormProps {
    className?: string;
}

export const FeedbackForm: FC<FeedbackFormProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [errorText, setErrorText] = useState<string | undefined>();

    const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

    const isValid = name.trim() !== ""
        && EMAIL_REGEXP.test(email.trim())
        && message.trim() !== "";

    const handleReset = () => {
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
            setErrorText(t("Не удалось отправить сообщение. Попробуйте ещё раз."));
        }
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            {isSent ? (
                <>
                    <h2>{t("Спасибо! Ваше сообщение отправлено.")}</h2>
                    <p className={styles.description}>{t("Мы ответим вам на указанный email.")}</p>
                    <Button onClick={handleReset} variant="FILL" size="MEDIUM" color="BLUE">
                        {t("Написать ещё раз")}
                    </Button>
                </>
            ) : (
                <>
                    <Input
                        id="feedback-name"
                        label={t("Ваше имя")}
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
                        label={t("Сообщение")}
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
                            <span className={buttonStyles.text}>{t("Отправить")}</span>
                        )}
                    </button>
                </>
            )}
        </div>
    );
};
