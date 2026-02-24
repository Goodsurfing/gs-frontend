import React from "react";
import { useParams } from "react-router-dom";
import { AdminJournalInfo } from "@/widgets/Admin";

const AdminJournalPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id журнала</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminJournalInfo journalId={id} />
        </div>
    );
};

export default AdminJournalPersonalPage;
