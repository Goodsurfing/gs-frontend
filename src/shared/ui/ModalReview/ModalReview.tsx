import { Rating } from "@mui/material";
import React, {
    FC, ReactNode,
    useCallback,
    useEffect,
} from "react";

import { useTranslation } from "react-i18next";
import cn from "classnames";
import Button from "../Button/Button";
import { Modal } from "../Modal/Modal";
import Textarea from "../Textarea/Textarea";
import styles from "./ModalReview.module.scss";
import { ErrorText } from "../ErrorText/ErrorText";
import { ImagesUploader } from "../ImagesUploader/ImagesUploader";
import { MediaObjectType } from "@/types/media";

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
    images?: MediaObjectType[];
    onImagesChange?: (images: MediaObjectType[]) => void;
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
        images,
        onImagesChange,
    } = props;
    const {
        stars, text,
    } = value;
    const { t } = useTranslation("host");

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
    }, [isOpen]);

    const handleUploadImages = useCallback(async (uploaded: MediaObjectType[]) => {
        onImagesChange?.([...(images ?? []), ...uploaded]);
    }, [images, onImagesChange]);

    const handleDeleteImage = useCallback((imgId: string) => {
        onImagesChange?.((images ?? []).filter((img) => img.id !== imgId));
    }, [images, onImagesChange]);

    if (successText) {
        return (
            <Modal onClose={onClose} isShowCloseIcon>
                <div className={cn(styles.wrapper, { [styles.active]: isOpen })}>
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
        <Modal
            onClose={onClose}
            isShowCloseIcon
            className={cn(
                styles.modalWrapper,
                { [styles.active]: isOpen },
            )}
        >
            <div className={cn(styles.wrapper, { [styles.active]: isOpen })}>
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
                    label={t("host-dashboard.Напишите ваш отзыв")}
                    maxLength={500}
                />
                {onImagesChange && (
                    <ImagesUploader
                        uploadedImgs={images ?? []}
                        onUpload={handleUploadImages}
                        onDelete={handleDeleteImage}
                        onError={() => {}}
                        maxLength={10}
                    />
                )}
                {errorText && (<ErrorText text={errorText} />)}
                {!stars && (
                    <p className={styles.hint}>
                        {t(
                            "host-dashboard.Поставьте оценку, чтобы оставить отзыв",
                            "Поставьте оценку, чтобы оставить отзыв",
                        )}
                    </p>
                )}
                <Button
                    onClick={() => handleSendReview()}
                    variant="FILL"
                    size="MEDIUM"
                    color="BLUE"
                    disabled={!stars || !text}
                >
                    {t("host-dashboard.Оставить отзыв")}
                </Button>
            </div>
        </Modal>
    );
};
