import React, { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import { AdminReviewsNewsTable } from "../AdminReviewsNewsTable/AdminReviewsNewsTable";
import { AdminReviewsJournalTable } from "../AdminReviewsJournalTable/AdminReviewsJournalTable";
import { AdminReviewsVideoTable } from "../AdminReviewsVideoTable/AdminReviewsVideoTable";
import styles from "./AdminReviewsCommunity.module.scss";

export const AdminReviewsCommunity = () => {
    const [isNewsTableOpen, setNewsTableOpen] = useState(false);
    const [isJournalTableOpen, setJournalTableOpen] = useState(false);
    const [isVideoTableOpen, setVideoTableOpen] = useState(false);

    const newsTextButton = isNewsTableOpen ? "Закрыть комментарии новостей" : "Открыть комментарии новостей";
    const journalTextButton = isJournalTableOpen ? "Закрыть комментарии журналов" : "Открыть комментарии журналов";
    const videoTextButton = isVideoTableOpen ? "Закрыть комментарии видео" : "Открыть комментарии видео";

    const handleNewsTableOpen = () => {
        setNewsTableOpen((prev) => !prev);
    };

    const handleJournalsTableOpen = () => {
        setJournalTableOpen((prev) => !prev);
    };

    const handleVideoTableOpen = () => {
        setVideoTableOpen((prev) => !prev);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <Button onClick={handleNewsTableOpen} color="BLUE" size="SMALL" variant="FILL">{newsTextButton}</Button>
                <Button onClick={handleJournalsTableOpen} color="GREEN" size="SMALL" variant="FILL">{journalTextButton}</Button>
                <Button onClick={handleVideoTableOpen} color="GRAY" size="SMALL" variant="FILL">{videoTextButton}</Button>
            </div>
            {isNewsTableOpen && <AdminReviewsNewsTable />}
            {isJournalTableOpen && <AdminReviewsJournalTable />}
            {isVideoTableOpen && <AdminReviewsVideoTable />}
        </div>
    );
};
