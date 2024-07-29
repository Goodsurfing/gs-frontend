import React, { FC, MouseEventHandler } from "react";
import styles from "./ConfirmActionModal.module.scss";
import Button from "../Button/Button";
import { Modal } from "../Modal/Modal";

interface ConfirmActionModalProps {
    description: string;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    confirmTextButton?: string;
    onClose: () => void;
    cancelTextButton?: string;
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = (props) => {
    const {
        description, onConfirm, onClose, confirmTextButton = "Ок", cancelTextButton = "Отмена",
    } = props;
    return (
        <Modal onClose={onClose} isShowCloseIcon={false}>
            <div className={styles.wrapper}>
                <span className={styles.description}>{description}</span>
                <div className={styles.buttons}>
                    <Button color="GREEN" size="MEDIUM" variant="FILL" onClick={onConfirm}>
                        {confirmTextButton}
                    </Button>
                    <Button color="GRAY" size="MEDIUM" variant="OUTLINE" onClick={onClose}>
                        {cancelTextButton}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};