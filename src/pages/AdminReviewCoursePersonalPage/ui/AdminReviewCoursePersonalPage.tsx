import React from "react";
import { useParams } from "react-router-dom";
import { AdminReviewCourseInfo } from "@/widgets/Admin";

const AdminReviewCoursePersonalPage = () => {
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
            <AdminReviewCourseInfo reviewId={id} />
        </div>
    );
};

export default AdminReviewCoursePersonalPage;
