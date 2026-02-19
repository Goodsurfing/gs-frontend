import React from "react";
import { useParams } from "react-router-dom";
import { AdminCategoryBlogInfo } from "@/widgets/Admin";

const AdminCategoriesBlogPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id категории</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminCategoryBlogInfo categoryId={Number(id)} />
        </div>
    );
};

export default AdminCategoriesBlogPersonalPage;
