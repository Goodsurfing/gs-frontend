import React from "react";
import { useParams } from "react-router-dom";
import { AdminReviewVideoInfo } from "@/widgets/Admin";

const AdminReviewVideoPersonalPage = () => {
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
            <AdminReviewVideoInfo reviewId={id} />
        </div>
    );
};

export default AdminReviewVideoPersonalPage;
