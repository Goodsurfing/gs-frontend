import React from "react";
import { useParams } from "react-router-dom";
import { AdminFoodInfo } from "@/widgets/Admin";

const AdminFoodPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id питания</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminFoodInfo foodId={Number(id)} />
        </div>
    );
};

export default AdminFoodPersonalPage;
