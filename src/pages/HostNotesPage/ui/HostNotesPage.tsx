import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { NotesWidget } from "@/widgets/NotesWidget";

import { useGetMyHostApplicationsQuery } from "@/entities/Host";
import { mockedApplications } from "@/entities/Host/model/data/mockedHostData";
import { RequestCard } from "@/entities/Request";

import { ModalReview } from "@/shared/ui/ModalReview/ModalReview";
import Preloader from "@/shared/ui/Preloader/Preloader";

import styles from "./HostNotesPage.module.scss";

const HostNotesPage = () => {
    const { t, ready } = useTranslation();
    const { data: applications, isLoading } = useGetMyHostApplicationsQuery();
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
        null,
    );

    const onReviewClick = (id: number) => {
        setSelectedReviewId(id);
    };

    const resetSelectedReview = () => {
        setSelectedReviewId(null);
    };

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
                    onReviewClick={onReviewClick}
                />
                <ModalReview
                    isOpen={!!selectedReviewId}
                    onClose={resetSelectedReview}
                    titleText="Оставьте отзыв"
                    sendReview={resetSelectedReview}
                >
                    <RequestCard
                        application={mockedApplications[0]}
                        showButtons={false}
                    />
                </ModalReview>
            </div>
        </div>
    );
};

export default HostNotesPage;
