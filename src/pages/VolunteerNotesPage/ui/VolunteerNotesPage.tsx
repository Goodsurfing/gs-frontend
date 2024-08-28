import React from "react";
import { useTranslation } from "react-i18next";
import { NotesVolunteerForm } from "@/features/Notes";

const VolunteerNotesPage = () => {
    const { t } = useTranslation("volunteer");

    return (
        <div>
            <h2>{t("volunteer-notes.Мои заявки")}</h2>
            <NotesVolunteerForm />
        </div>
    );
};

export default VolunteerNotesPage;
