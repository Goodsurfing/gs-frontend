import React, {
    FC, useEffect, useMemo, useState,
} from "react";
import cn from "classnames";
import Button from "@/shared/ui/Button/Button";
import { Modal } from "@/shared/ui/Modal/Modal";
import styles from "./AdminUpdateSkills.module.scss";
import { Skill } from "@/types/skills";
import { Skills } from "@/features/SkillsForm";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useGetPublicSkillsQuery } from "@/entities/Admin";

interface AdminUpdateSkillsProps {
    currentSkillIds: number[];
    onConfirm: (selected: Skill[]) => void;
    isModalOpen: boolean;
    onClose: () => void;
}

export const AdminUpdateSkills: FC<AdminUpdateSkillsProps> = ({
    currentSkillIds,
    onConfirm,
    isModalOpen,
    onClose,
}) => {
    const { data: skillsData = [], isLoading } = useGetPublicSkillsQuery();
    const [selectedSkillIds, setSelectedSkillIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (isModalOpen) {
            setSelectedSkillIds(new Set(currentSkillIds));
        }
    }, [isModalOpen, currentSkillIds]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    const selectedSkills = useMemo(
        () => skillsData.filter((skill) => selectedSkillIds.has(skill.id)),
        [skillsData, selectedSkillIds],
    );

    const handleChange = (newSkills: Skill[]) => {
        const newIds = new Set(newSkills.map((s) => s.id));
        setSelectedSkillIds(newIds);
    };

    const handleConfirm = () => {
        onConfirm(selectedSkills);
        onClose();
    };

    if (isLoading && isModalOpen) {
        return (
            <Modal
                isShowCloseIcon={false}
                onClose={onClose}
                className={cn(styles.modalWrapper, { [styles.active]: isModalOpen })}
            >
                <div className={styles.modal}>
                    <MiniLoader />
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon={false}
            className={cn(styles.modalWrapper, { [styles.active]: isModalOpen })}
        >
            <div className={styles.modal}>
                <h3>Выберите навыки</h3>
                <Skills
                    skills={skillsData}
                    value={selectedSkills}
                    onChange={handleChange}
                    className={styles.list}
                />
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
