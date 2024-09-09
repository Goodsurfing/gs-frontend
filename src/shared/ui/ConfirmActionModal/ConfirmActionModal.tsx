import React, { FC, MouseEventHandler } from "react";
import cn from "classnames";
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
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = (props) => {
    const {
        description, onConfirm, onClose, confirmTextButton = "Ок", cancelTextButton = "Отмена", isModalOpen = false, buttonsDisabled = false,
        className,
    } = props;

    if (!isModalOpen) {
        return null;
    }

    return (
        <Modal onClose={onClose} isShowCloseIcon={false}>
            <div className={cn(styles.wrapper, className)}>
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
            </div>
        </Modal>
    );
};
