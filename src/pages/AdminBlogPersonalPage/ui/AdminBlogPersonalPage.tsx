import React from "react";
import { useParams } from "react-router-dom";
import { AdminBlogInfo } from "@/widgets/Admin";

const AdminBlogPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id статьи</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminBlogInfo blogId={id} />
        </div>
    );
};

export default AdminBlogPersonalPage;
