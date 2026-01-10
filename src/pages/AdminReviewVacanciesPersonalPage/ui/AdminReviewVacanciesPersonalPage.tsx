import React from "react";
import { useParams } from "react-router-dom";
import { AdminReviewVacancyInfo } from "@/widgets/Admin";

const AdminReviewVacanciesPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id отзыва</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminReviewVacancyInfo reviewId={id} />
        </div>
    );
};

export default AdminReviewVacanciesPersonalPage;
