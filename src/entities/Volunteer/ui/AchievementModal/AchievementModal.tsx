import React, { FC, useEffect } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { AchievementWithImage } from "@/types/achievements";
import { Modal } from "@/shared/ui/Modal/Modal";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./AchievementModal.module.scss";

interface AchievementModalProps {
    achievements: AchievementWithImage[];
    isModalOpen: boolean;
    onClose: () => void;
}

export const AchievementModal: FC<AchievementModalProps> = (props) => {
    const { achievements, isModalOpen, onClose } = props;
    const { t } = useTranslation("profile");

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
    }, [isModalOpen]);

    const renderAchievements = () => achievements.map((medal) => (
        <div className={styles.medal} key={medal.id}>
            <img
                className={styles.medalIcon}
                src={getMediaContent(medal.image, "SMALL")}
                alt={medal.name}
            />
            <span>{medal.name}</span>
        </div>
    ));

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon={false}
            className={cn(
                styles.modalWrapper,
                { [styles.active]: isModalOpen },
            )}
        >
            <div className={cn(styles.wrapper, { [styles.active]: isModalOpen })}>
                <h3>{t("personal.Все достижения пользователя")}</h3>
                <div className={styles.container}>
                    {renderAchievements()}
                </div>
            </div>
        </Modal>
    );
};
