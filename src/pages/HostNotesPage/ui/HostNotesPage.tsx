import React from "react";

import { useTranslation } from "react-i18next";
import { NotesWidget } from "@/widgets/NotesWidget";

import Preloader from "@/shared/ui/Preloader/Preloader";
import { useGetMyApplicationsQuery } from "@/entities/Host/api/hostApi";
import styles from "./HostNotesPage.module.scss";

const HostNotesPage = () => {
    const { t, ready } = useTranslation();
    const { data: applications, isLoading } = useGetMyApplicationsQuery();

    if (!ready || isLoading) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapper}>
                <h1>{t("notes.Мои заявки")}</h1>
                <NotesWidget
                    notes={applications ?? []}
                    className={styles.notes}
                    variant="host"
                    isDragDisable={false}
                />
            </div>
        </div>
    );
};

export default HostNotesPage;
