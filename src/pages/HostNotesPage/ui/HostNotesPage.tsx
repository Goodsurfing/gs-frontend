import React from "react";
import { useTranslation } from "react-i18next";

import { NotesHostForm } from "@/features/Notes";
import Preloader from "@/shared/ui/Preloader/Preloader";

import styles from "./HostNotesPage.module.scss";

const HostNotesPage = () => {
    const { t, ready } = useTranslation();

    if (!ready) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h1>{t("notes.Мои заявки")}</h1>
            <NotesHostForm />
        </div>
    );
};

export default HostNotesPage;
