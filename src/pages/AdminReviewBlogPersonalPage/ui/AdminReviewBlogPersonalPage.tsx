import React from "react";
import { useParams } from "react-router-dom";
import { AdminReviewBlogInfo } from "@/widgets/Admin";

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
            <AdminReviewBlogInfo reviewId={id} />
        </div>
    );
};

export default AdminReviewBlogPersonalPage;
