import React from "react";
import { useParams } from "react-router-dom";
import { AdminOurTeamInfo } from "@/widgets/Admin";

const AdminOurTeamPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id участника</h2>
            </div>
        );
    }

    return (
        <div>
            <AdminOurTeamInfo memberId={id} />
        </div>
    );
};

export default AdminOurTeamPersonalPage;
