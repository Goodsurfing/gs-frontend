import React from "react";

import styles from "./VolunteerNotesPage.module.scss";
import { NotesWidget } from "@/widgets/NotesWidget";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

const VolunteerNotesPage = () => (
    <div className={styles.wrapper}>
        <h2>Мои заявки</h2>
        <NotesWidget className={styles.notes} offers={mockedOffersData} isDragDisable />
    </div>
);

export default VolunteerNotesPage;
