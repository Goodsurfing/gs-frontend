import React, { FC, ReactNode, useState } from "react";
import { Rating } from "@mui/material";
import { Modal } from "../Modal/Modal";
import styles from "./ModalReview.module.scss";
import Button from "../Button/Button";
import Textarea from "../Textarea/Textarea";

interface ModalReviewProps {
    isOpen: boolean;
    onClose: () => void;
    titleText: string;
    sendReview: (rating: number, textReview: string) => void;
    children?: ReactNode;
}

export const ModalReview: FC<ModalReviewProps> = (props) => {
    const {
        isOpen, onClose, titleText, sendReview, children,
    } = props;
    const [ratingValue, setRatingValue] = useState<number | null>(null);
    const [textReview, setTextReview] = useState<string>("");
    const [isReviewSended, setReviewSended] = useState<boolean>(false);

    if (!isOpen) {
        return null;
    }

    if (isReviewSended) {
        return (
            <Modal
                onClose={onClose}
                isShowCloseIcon
            >
                <div className={styles.wrapper}>
                    <h2>Ваш отзыв был отправлен</h2>
                </div>
            </Modal>
        );
    }

    const handleSendReview = () => {
        if (!ratingValue || !textReview) return;
        sendReview(ratingValue, textReview);
        setReviewSended(true);
    };

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon
        >
            <div className={styles.wrapper}>
                <h2>{titleText}</h2>
                {children}
                <Rating
                    size="large"
                    value={ratingValue}
                    onChange={(_, value) => setRatingValue(value)}
                    sx={{
                        "& .MuiRating-iconFilled": {
                            color: "#FED81C",
                        },
                    }}
                />
                <Textarea
                    // className={cn(styles.container, styles.textarea)}
                    value={textReview}
                    onChange={(event) => setTextReview(event.target.value)}
                    label="Напишите ваш отзыв"
                    maxLength={1000}
                />
                <Button
                    onClick={() => handleSendReview()}
                    variant="FILL"
                    size="MEDIUM"
                    color="BLUE"
                >
                    Оставить отзыв
                </Button>
            </div>
        </Modal>
    );
};
