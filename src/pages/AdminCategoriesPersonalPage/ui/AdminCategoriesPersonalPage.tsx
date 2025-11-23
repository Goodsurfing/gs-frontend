import React from "react";
import { useParams } from "react-router-dom";

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
            Personal category page
        </div>
    );
};

export default AdminCategoriesPersonalPage;
