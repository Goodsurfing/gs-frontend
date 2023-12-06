import React from "react";

import styles from "./VolunteerNotesPage.module.scss";
import { NotesWidget } from "@/widgets/NotesWidget";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

const VolunteerNotesPage = () => (
    <div className={styles.wrapper}>
        <h1>Мои заявки</h1>
        <NotesWidget offers={mockedOffersData} />
    </div>
);

export default VolunteerNotesPage;
