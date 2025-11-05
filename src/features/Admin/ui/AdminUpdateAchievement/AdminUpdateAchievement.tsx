import React, { FC, useEffect, useState } from "react";
import cn from "classnames";
import Button from "@/shared/ui/Button/Button";
import { Modal } from "@/shared/ui/Modal/Modal";
import styles from "./AdminUpdateAchievement.module.scss";

interface Achievement {
    id: string;
    name: string;
}

interface AdminUpdateAchievementProps {
    achievements: Achievement[];
    onConfirm: (selected: Achievement[]) => void;
    isModalOpen: boolean;
    onClose: () => void;
}

export const AdminUpdateAchievement: FC<AdminUpdateAchievementProps> = ({
    achievements,
    onConfirm,
    isModalOpen,
    onClose,
}) => {
    const [selectedAchievements, setSelectedAchievements] = useState<Set<string>>(new Set());

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
    }, [isModalOpen]);

    const toggleAchievement = (id: string) => {
        setSelectedAchievements((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleConfirm = () => {
        const selected = achievements.filter((a) => selectedAchievements.has(a.id));
        onConfirm(selected);
        onClose();
    };

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon={false}
            className={cn(
                styles.modalWrapper,
                { [styles.active]: isModalOpen },
            )}
        >
            <div className={styles.modal}>
                <h3>Выберите достижения</h3>
                <ul className={styles.list}>
                    {achievements.map((a) => (
                        <li key={a.id} style={{ listStyle: "none", marginBottom: 8 }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedAchievements.has(a.id)}
                                    onChange={() => toggleAchievement(a.id)}
                                />
                                {" "}
                                {a.name}
                            </label>
                        </li>
                    ))}
                </ul>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                    <Button onClick={handleConfirm} color="BLUE" size="SMALL" variant="FILL">
                        Подтвердить
                    </Button>
                    <Button onClick={onClose} color="GRAY" size="SMALL" variant="FILL">
                        Отмена
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
