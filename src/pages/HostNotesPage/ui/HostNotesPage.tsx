import React from "react";
import { useTranslation } from "react-i18next";

import { NotesHostForm } from "@/features/Notes";

import styles from "./HostNotesPage.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const HostNotesPage = () => {
    const { t, ready } = useTranslation("host");

    if (!ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h2>{t("hostNotes.Мои заявки")}</h2>
            <NotesHostForm />
        </div>
    );
};

export default HostNotesPage;
