import React from "react";
import { useParams } from "react-router-dom";
import { AdminAchievementInfo } from "@/widgets/Admin";

const AdminAchievementPersonalPage = () => {
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
            <AdminAchievementInfo achievementId={Number(id)} />
        </div>
    );
};

export default AdminAchievementPersonalPage;
