import React from "react";

import { NotesWidget } from "@/widgets/NotesWidget";

import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import styles from "./HostNotesPage.module.scss";

const HostNotesPage = () => (
    <div className={styles.wrapper}>
        <div className={styles.wrapper}>
            <h1>Мои заявки</h1>
            <NotesWidget
                className={styles.notes}
                offers={mockedOffersData}
                isDragDisable={false}
            />
        </div>
    </div>
);

export default HostNotesPage;
