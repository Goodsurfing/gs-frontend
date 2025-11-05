import React, { FC, useState } from "react";
import styles from "./AdminUserSettings.module.scss";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { AdminUpdateAchievement } from "../AdminUpdateAchievement/AdminUpdateAchievement";

const achievementsList = [
    { id: "1", name: "Достижение 1" },
    { id: "2", name: "Достижение 2" },
    { id: "3", name: "Достижение 3" },
    { id: "4", name: "Достижение 4" },
    { id: "5", name: "Достижение 5" },
    { id: "6", name: "Достижение 6" },
    { id: "7", name: "Достижение 7" },
    { id: "8", name: "Достижение 8" },
    { id: "9", name: "Достижение 9" },
];

export const AdminUserSettings: FC = () => {
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isAchievementModalOpen, setAchievementModalOpen] = useState(false);

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
        openConfirmModal("Вы уверены, что хотите заблокировать пользователя?", () => {
            setToast({ text: "Пользователь заблокирован", type: HintType.Success });
        });
    };

    const handleDeleteUser = () => {
        openConfirmModal("Удалить пользователя безвозвратно?", () => {
            setToast({ text: "Пользователь удалён", type: HintType.Success });
        });
    };

    const handleMembership = () => {
        openConfirmModal("Активировать членство пользователя?", () => {
            setToast({ text: "Членство активировано", type: HintType.Success });
        });
    };

    const handleUpdateAchievements = () => {
        setToast(null);
        setAchievementModalOpen(true);
    };

    const handleConfirm = () => {
        onConfirmAction();
        setConfirmModalOpen(false);
    };

    const handleCloseConfirmModal = () => setConfirmModalOpen(false);
    const handleCloseAchievementModal = () => setAchievementModalOpen(false);

    const handleAchievementsConfirm = (selected: { id: string; name: string }[]) => {
        setToast({
            text: `Присвоено достижений: ${selected.length}`,
            type: HintType.Success,
        });
        setAchievementModalOpen(false);
    };

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
                Заблокировать пользователя
            </Button>
            <Button
                className={styles.button}
                color="RED"
                size="SMALL"
                variant="FILL"
                onClick={handleDeleteUser}
            >
                Удалить пользователя
            </Button>
            <Button
                className={styles.button}
                color="GREEN"
                size="SMALL"
                variant="FILL"
                onClick={handleMembership}
            >
                Активировать членство
            </Button>
            <Button
                className={styles.button}
                color="BLUE"
                size="SMALL"
                variant="FILL"
                onClick={handleUpdateAchievements}
            >
                Присвоить достижение
            </Button>
            <ConfirmActionModal
                description={modalDescription}
                onConfirm={handleConfirm}
                onClose={handleCloseConfirmModal}
                isModalOpen={isConfirmModalOpen}
            />
            <AdminUpdateAchievement
                achievements={achievementsList}
                isModalOpen={isAchievementModalOpen}
                onClose={handleCloseAchievementModal}
                onConfirm={handleAchievementsConfirm}
            />
        </div>
    );
};
