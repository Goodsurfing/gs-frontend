import React, {
    FC, useEffect, useState,
} from "react";
import cn from "classnames";
import Button from "@/shared/ui/Button/Button";
import { Modal } from "@/shared/ui/Modal/Modal";
import { AdditionalSkills, Skills } from "@/features/SkillsForm";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useGetPublicSkillsQuery } from "@/entities/Admin";
import { AdditionalSkillsType } from "@/features/OfferWhatToDo";
import styles from "./AdminUpdateSkills.module.scss";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface AdminUpdateSkillsProps {
    currentSkillIds: number[];
    currentAdditionalSkills: string[];
    onConfirm: (selected: {
        skills: number[];
        additionalSkills: string[];
    }) => void;
    isModalOpen: boolean;
    onClose: () => void;
    locale: Locale;
}

export const AdminUpdateSkills: FC<AdminUpdateSkillsProps> = ({
    currentSkillIds,
    currentAdditionalSkills,
    onConfirm,
    isModalOpen,
    onClose,
    locale,
}) => {
    const { data: skillsData = [], isLoading } = useGetPublicSkillsQuery({ lang: locale });
    const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);

    const [additionalSkills, setAdditionalSkills] = useState<AdditionalSkillsType[]>([]);

    useEffect(() => {
        if (isModalOpen) {
            setSelectedSkillIds(currentSkillIds);
            setAdditionalSkills(currentAdditionalSkills.map((text) => ({ text })));
        }
    }, [isModalOpen, currentSkillIds, currentAdditionalSkills]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    // const selectedSkills = useMemo(
    //     () => skillsData.filter((skill) => selectedSkillIds.has(skill.id)),
    //     [skillsData, selectedSkillIds],
    // );

    const handleMainSkillsChange = (newSkills: number[]) => {
        setSelectedSkillIds(newSkills);
    };

    const handleAdditionalSkillsChange = (newAdditional: AdditionalSkillsType[]) => {
        setAdditionalSkills(newAdditional);
    };

    const handleConfirm = () => {
        const additionalSkillsStrings = additionalSkills.map((item) => item.text);
        onConfirm({
            skills: selectedSkillIds,
            additionalSkills: additionalSkillsStrings,
        });
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
                    value={selectedSkillIds}
                    onChange={handleMainSkillsChange}
                    className={styles.list}
                />

                <div className={styles.list}>
                    <h4>Дополнительные навыки</h4>
                    <AdditionalSkills
                        value={additionalSkills}
                        onChange={handleAdditionalSkillsChange}
                    />
                </div>

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
