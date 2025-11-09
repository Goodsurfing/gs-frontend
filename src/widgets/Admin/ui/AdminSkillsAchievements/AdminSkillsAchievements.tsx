import React, { useState } from "react";
import styles from "./AdminSkillsAchievements.module.scss";
import Button from "@/shared/ui/Button/Button";

export const AdminSkillsAchievements = () => {
    const [isSkillsTableOpen, setSkillsTableOpen] = useState(false);
    const [isAchievementsTableOpen, setAchievementsTableOpen] = useState(false);

    const skillsTextButton = isSkillsTableOpen ? "Закрыть таблицу навыков" : "Открыть таблицу навыков";
    const achievementsTextButton = isAchievementsTableOpen ? "Закрыть таблицу достижений" : "Открыть таблицу достижений";

    const handleSkillsTableOpen = () => {
        setSkillsTableOpen((prev) => !prev);
    };

    const handleAchievementsTableOpen = () => {
        setAchievementsTableOpen((prev) => !prev);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <Button onClick={handleSkillsTableOpen} color="BLUE" size="SMALL" variant="FILL">{skillsTextButton}</Button>
                <Button onClick={handleAchievementsTableOpen} color="GREEN" size="SMALL" variant="FILL">{achievementsTextButton}</Button>
            </div>
            {isSkillsTableOpen && <div>Таблица навыков</div>}
            {isAchievementsTableOpen && <div>Таблица достижений</div>}
        </div>
    );
};
