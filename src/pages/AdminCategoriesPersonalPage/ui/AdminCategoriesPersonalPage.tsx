import React from "react";
import { useParams } from "react-router-dom";
import { AdminCategoryInfo } from "@/widgets/Admin";

const AdminCategoriesPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id навыка</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminCategoryInfo categoryId={id} />
        </div>
    );
};

export default AdminCategoriesPersonalPage;
