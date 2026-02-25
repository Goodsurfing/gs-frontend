import React from "react";
import { useParams } from "react-router-dom";
import { AdminVideoInfo } from "@/widgets/Admin";

const AdminVideoPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id видео</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminVideoInfo videoId={id} />
        </div>
    );
};

export default AdminVideoPersonalPage;
