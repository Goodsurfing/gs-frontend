import React from "react";

import { NotesWidget } from "@/widgets/NotesWidget";

import styles from "./HostNotesPage.module.scss";
import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";

const HostNotesPage = () => (
    <div className={styles.wrapper}>
        <div className={styles.wrapper}>
            <h1>Мои заявки</h1>
            <NotesWidget
                notes={mockedApplications}
                className={styles.notes}
                variant="host"
                isDragDisable={false}
            />
        </div>
    </div>
);

export default HostNotesPage;
