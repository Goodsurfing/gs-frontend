import React from "react";
import { useParams } from "react-router-dom";
import { AdminReviewJournalInfo } from "@/widgets/Admin";

const AdminReviewBlogPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id комментария</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminReviewJournalInfo reviewId={id} />
        </div>
    );
};

export default AdminReviewBlogPersonalPage;
