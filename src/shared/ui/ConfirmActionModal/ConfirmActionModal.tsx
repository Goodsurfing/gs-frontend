import { CircularProgress } from "@mui/material";
import cn from "classnames";
import React, { FC, MouseEventHandler, useEffect } from "react";

import Button from "../Button/Button";
import { Modal } from "../Modal/Modal";
import styles from "./ConfirmActionModal.module.scss";

interface ConfirmActionModalProps {
    description: string;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    confirmTextButton?: string;
    onClose: () => void;
    cancelTextButton?: string;
    isModalOpen?: boolean;
    buttonsDisabled?: boolean;
    className?: string;
    isLoading?: boolean;
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = (props) => {
    const {
        description,
        onConfirm,
        onClose,
        confirmTextButton = "Ок",
        cancelTextButton = "Отмена",
        isModalOpen = false,
        isLoading = false,
        buttonsDisabled = false,
        className,
    } = props;

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
    }, [isModalOpen]);

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon={false}
            className={cn(
                styles.modalWrapper,
                { [styles.active]: isModalOpen },
            )}
        >
            <div className={cn(styles.wrapper, className, { [styles.active]: isModalOpen })}>
                {isLoading ? (
                    <CircularProgress style={{ color: "var(--accent-color)" }} />
                ) : (
                    <>
                        <span className={styles.description}>{description}</span>
                        <div className={styles.buttons}>
                            <Button
                                className={styles.blue}
                                color="BLUE"
                                size="MEDIUM"
                                variant="FILL"
                                onClick={onConfirm}
                                disabled={buttonsDisabled}
                            >
                                {confirmTextButton}
                            </Button>
                            <Button
                                className={styles.gray}
                                color="GRAY"
                                size="MEDIUM"
                                variant="OUTLINE"
                                onClick={onClose}
                                disabled={buttonsDisabled}
                            >
                                {cancelTextButton}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};
