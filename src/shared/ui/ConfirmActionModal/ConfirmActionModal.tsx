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
    isModalOpen?: boolean;
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = (props) => {
    const {
        description, onConfirm, onClose, confirmTextButton = "Ок", cancelTextButton = "Отмена", isModalOpen = false,
    } = props;
    return (
        isModalOpen && (
            <Modal onClose={onClose} isShowCloseIcon={false}>
                <div className={styles.wrapper}>
                    <span className={styles.description}>{description}</span>
                    <div className={styles.buttons}>
                        <Button className={styles.blue} color="BLUE" size="MEDIUM" variant="FILL" onClick={onConfirm}>
                            {confirmTextButton}
                        </Button>
                        <Button className={styles.gray} color="GRAY" size="MEDIUM" variant="OUTLINE" onClick={onClose}>
                            {cancelTextButton}
                        </Button>
                    </div>
                </div>
            </Modal>
        )
    );
};
