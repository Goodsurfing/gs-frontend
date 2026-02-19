import React from "react";
import { useParams } from "react-router-dom";
import { AdminReviewNewsInfo } from "@/widgets/Admin";

const AdminReviewNewsPersonalPage = () => {
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
            <AdminReviewNewsInfo reviewId={id} />
        </div>
    );
};

export default AdminReviewNewsPersonalPage;
