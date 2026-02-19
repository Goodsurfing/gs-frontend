import React from "react";
import { useParams } from "react-router-dom";
import { AdminNewsInfo } from "@/widgets/Admin";

const AdminNewsPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id новости</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminNewsInfo newsId={id} />
        </div>
    );
};

export default AdminNewsPersonalPage;
