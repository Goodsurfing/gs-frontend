import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./VolunteerNotesPage.module.scss";
import { NotesWidget } from "@/widgets/NotesWidget";
import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";

const VolunteerNotesPage = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-notes.Мои заявки")}</h2>
            <NotesWidget className={styles.notes} notes={mockedApplications} variant="volunteer" isDragDisable />
        </div>
    );
};

export default VolunteerNotesPage;
