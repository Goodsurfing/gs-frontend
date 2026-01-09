import React, { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import { AdminReviewVacanciesTable } from "../AdminReviewVacanciesTable/AdminReviewVacanciesTable";
import { AdminReviewVolunteersTable } from "../AdminReviewVolunteersTable/AdminReviewVolunteersTable";
import styles from "./AdminReviews.module.scss";

export const AdminReviews = () => {
    const [isVacanciesTableOpen, setVacanciesTableOpen] = useState(false);
    const [isVolunteersTableOpen, setVolunteersTableOpen] = useState(false);

    const vacanciesTextButton = isVacanciesTableOpen ? "Закрыть отзывы на вакансии" : "Открыть отзывы на вакансии";
    const volunteersTextButton = isVolunteersTableOpen ? "Закрыть отзывы на волонтёров" : "Открыть отзывы на волонтёров";

    const handleVacanciesTableOpen = () => {
        setVacanciesTableOpen((prev) => !prev);
    };

    const handleVolunteersTableOpen = () => {
        setVolunteersTableOpen((prev) => !prev);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <Button onClick={handleVacanciesTableOpen} color="BLUE" size="SMALL" variant="FILL">{vacanciesTextButton}</Button>
                <Button onClick={handleVolunteersTableOpen} color="GREEN" size="SMALL" variant="FILL">{volunteersTextButton}</Button>
            </div>
            {isVacanciesTableOpen && <AdminReviewVacanciesTable />}
            {isVolunteersTableOpen && <AdminReviewVolunteersTable />}
        </div>
    );
};
