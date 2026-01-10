import React from "react";
import { useParams } from "react-router-dom";
import { AdminReviewVolunteerInfo } from "@/widgets/Admin";

const AdminReviewVolunteerPersonalPage = () => {
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
            <AdminReviewVolunteerInfo reviewId={id} />
        </div>
    );
};

export default AdminReviewVolunteerPersonalPage;
