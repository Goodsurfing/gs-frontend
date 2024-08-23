import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import styles from "./VolunteerNotesPage.module.scss";
import { NotesWidget } from "@/widgets/NotesWidget";
import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";

const VolunteerNotesPage = () => {
    const { t } = useTranslation("volunteer");
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

    const onReviewClick = (id: number) => {
        setSelectedReviewId(id);
    };

    const resetSelectedReview = () => {
        setSelectedReviewId(null);
    };

    const onClose = () => {};

    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-notes.Мои заявки")}</h2>
            <NotesWidget className={styles.notes} notes={mockedApplications} variant="volunteer" onReviewClick={onReviewClick} isDragDisable />
            <ModalReview isOpen onClose={onClose} titleText="Оставьте отзыв" sendReview={onClose} />
        </div>
    );
};

export default VolunteerNotesPage;
