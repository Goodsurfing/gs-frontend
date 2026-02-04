import React from "react";
import { useTranslation } from "react-i18next";
import { NotesVolunteerForm } from "@/features/Notes";
import styles from "./VolunteerNotesPage.module.scss";

const VolunteerNotesPage = () => {
    const { t } = useTranslation("volunteer");

    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-notes.Мои заявки")}</h2>
            <NotesVolunteerForm />
        </div>
    );
};

export default VolunteerNotesPage;
