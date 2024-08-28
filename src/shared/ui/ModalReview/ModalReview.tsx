import { Rating } from "@mui/material";
import React, {
    FC, ReactNode,
} from "react";

import Button from "../Button/Button";
import { Modal } from "../Modal/Modal";
import Textarea from "../Textarea/Textarea";
import styles from "./ModalReview.module.scss";
import { ErrorText } from "../ErrorText/ErrorText";

interface ReviewType {
    stars: number | undefined;
    text: string;
}

interface ModalReviewProps {
    isOpen: boolean;
    onClose: () => void;
    titleText: string;
    sendReview: () => void;
    value: ReviewType;
    onChange: (value: ReviewType) => void;
    successText?: string;
    errorText?: string;
    children?: ReactNode;
}

export const ModalReview: FC<ModalReviewProps> = (props) => {
    const {
        isOpen,
        onClose,
        titleText,
        sendReview,
        children,
        value,
        onChange,
        successText,
        errorText,
    } = props;
    const {
        stars, text,
    } = value;

    if (!isOpen) {
        return null;
    }

    if (successText) {
        return (
            <Modal onClose={onClose} isShowCloseIcon>
                <div className={styles.wrapper}>
                    <h2>{successText}</h2>
                </div>
            </Modal>
        );
    }

    const handleSendReview = () => {
        if (!stars || !text) return;
        sendReview();
    };

    return (
        <Modal onClose={onClose} isShowCloseIcon>
            <div className={styles.wrapper}>
                <h2>{titleText}</h2>
                {children}
                <Rating
                    size="large"
                    value={stars}
                    onChange={(_, valueItem) => onChange({
                        ...value,
                        stars: valueItem ?? undefined,
                        text,
                    })}
                    sx={{
                        "& .MuiRating-iconFilled": {
                            color: "#FED81C",
                        },
                    }}
                />
                <Textarea
                    value={text}
                    onChange={(event) => onChange({
                        ...value,
                        text: event.target.value,
                        stars,
                    })}
                    label="Напишите ваш отзыв"
                    maxLength={500}
                />
                {errorText && (<ErrorText text={errorText} />)}
                <Button
                    onClick={() => handleSendReview()}
                    variant="FILL"
                    size="MEDIUM"
                    color="BLUE"
                    disabled={!stars || !text}
                >
                    Оставить отзыв
                </Button>
            </div>
        </Modal>
    );
};
