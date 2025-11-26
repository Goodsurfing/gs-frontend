import React, { useState } from "react";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import styles from "./AdminOrganizationSettings.module.scss";

export const AdminOrganizationSettings = () => {
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

    const [modalDescription, setModalDescription] = useState("");
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});
    const [toast, setToast] = useState<ToastAlert | null>(null);

    const openConfirmModal = (description: string, action: () => void) => {
        setToast(null);
        setModalDescription(description);
        setOnConfirmAction(() => action);
        setConfirmModalOpen(true);
    };

    const handleBlockUser = () => {
        openConfirmModal("Вы уверены, что хотите заблокировать организацию?", () => {
            setToast({ text: "Организация заблокирована", type: HintType.Success });
        });
    };

    const handleDeleteUser = () => {
        openConfirmModal("Удалить организацию безвозвратно?", () => {
            setToast({ text: "Организация удалёна", type: HintType.Success });
        });
    };

    const handleConfirm = () => {
        onConfirmAction();
        setConfirmModalOpen(false);
    };

    const handleCloseConfirmModal = () => setConfirmModalOpen(false);

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Button
                className={styles.button}
                color="GRAY"
                size="SMALL"
                variant="FILL"
                onClick={handleBlockUser}
            >
                Заблокировать организацию
            </Button>
            <Button
                className={styles.button}
                color="RED"
                size="SMALL"
                variant="FILL"
                onClick={handleDeleteUser}
            >
                Удалить организацию
            </Button>
            <ConfirmActionModal
                description={modalDescription}
                onConfirm={handleConfirm}
                onClose={handleCloseConfirmModal}
                isModalOpen={isConfirmModalOpen}
            />
        </div>
    );
};
