import React, { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import { AdminReviewsNewsTable } from "../AdminReviewsNewsTable/AdminReviewsNewsTable";
import styles from "./AdminReviewsCommunity.module.scss";

export const AdminReviewsCommunity = () => {
    const [isNewsTableOpen, setNewsTableOpen] = useState(false);

    const newsTextButton = isNewsTableOpen ? "Закрыть комментарии новостей" : "Открыть комментарии новостей";

    const handleSkillsTableOpen = () => {
        setNewsTableOpen((prev) => !prev);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <Button onClick={handleSkillsTableOpen} color="BLUE" size="SMALL" variant="FILL">{newsTextButton}</Button>
            </div>
            {isNewsTableOpen && <AdminReviewsNewsTable />}
        </div>
    );
};
