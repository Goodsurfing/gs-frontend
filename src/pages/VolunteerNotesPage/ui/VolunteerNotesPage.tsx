import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./VolunteerNotesPage.module.scss";
import { NotesWidget } from "@/widgets/NotesWidget";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

const VolunteerNotesPage = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-notes.Мои заявки")}</h2>
            <NotesWidget className={styles.notes} offers={mockedOffersData} isDragDisable />
        </div>
    );
};

export default VolunteerNotesPage;
